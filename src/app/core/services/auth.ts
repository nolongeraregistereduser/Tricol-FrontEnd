import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { TokenService } from './token';
import { User, LoginCredentials, RegisterData } from '../models/user.model';
import { TokenResponse } from '../models/token-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  // URL de base depuis la configuration d'environnement
  private readonly API_URL = environment.apiUrl;
  private readonly AUTH_ENDPOINT = `${this.API_URL}${environment.apiEndpoints.auth}`;
  private readonly USERS_ENDPOINT = `${this.API_URL}${environment.apiEndpoints.users}`;

  // BehaviorSubject pour partager l'état de l'utilisateur connecté
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  /**
   * Login avec email et mot de passe
   */
  login(credentials: LoginCredentials): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.AUTH_ENDPOINT}/login`, credentials).pipe(
      tap((response) => {
        // Stocker les tokens
        this.tokenService.setTokens(response.accessToken, response.refreshToken);
        // Récupérer les infos utilisateur
        this.loadCurrentUser();
      }),
      catchError((error) => {
        console.error('Erreur lors du login:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.AUTH_ENDPOINT}/register`, data).pipe(
      catchError((error) => {
        console.error('Erreur lors de l\'inscription:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresh du token d'accès
   */
  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('Aucun refresh token disponible'));
    }

    return this.http.post<TokenResponse>(`${this.AUTH_ENDPOINT}/refresh`, { refreshToken }).pipe(
      tap((response) => {
        this.tokenService.setAccessToken(response.accessToken);
      }),
      catchError((error) => {
        console.error('Erreur lors du refresh du token:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout (déconnexion)
   */
  logout(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Récupère l'utilisateur actuellement connecté depuis le backend
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.USERS_ENDPOINT}/me`).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
      }),
      catchError((error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Charge l'utilisateur courant (appelé après login)
   */
  loadCurrentUser(): void {
    if (this.tokenService.hasValidToken()) {
      this.getCurrentUser().subscribe({
        error: () => this.logout(),
      });
    }
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return this.tokenService.hasValidToken();
  }

  /**
   * Récupère l'utilisateur courant (valeur synchrone)
   */
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}
