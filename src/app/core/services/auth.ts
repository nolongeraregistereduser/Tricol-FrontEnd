import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, tap, catchError, throwError, switchMap } from 'rxjs';
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


  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<TokenResponse>(`${this.AUTH_ENDPOINT}/login`, credentials).pipe(
      tap((response) => {
        console.log('✅ Login réussi, tokens reçus:', response);
        // Stocker les tokens
        this.tokenService.setTokens(response.accessToken, response.refreshToken);
      }),
      switchMap((response) => {
        console.log('🔄 Tentative de récupération des infos utilisateur depuis /users/me...');
        
        // Essayer de récupérer les infos utilisateur
        return this.getCurrentUser().pipe(
          tap((user) => {
            console.log('✅ Utilisateur récupéré depuis /users/me:', user);
          }),
          catchError((userError) => {
            console.warn('⚠️ Endpoint /users/me non disponible ou erreur:', userError);
            console.log('📝 Création d\'un utilisateur à partir du token JWT...');
            
            // Décoder le token pour extraire les infos
            const decodedToken = this.tokenService.decodeToken(response.accessToken);
            console.log('🔍 Token décodé:', decodedToken);
            
            // Créer un utilisateur à partir du token
            const tempUser: User = {
              id: decodedToken?.sub ? parseInt(decodedToken.sub) : 0,
              username: decodedToken?.sub || credentials.username,
              email: decodedToken?.email || credentials.username,
              fullName: decodedToken?.fullName || credentials.username,
              roles: decodedToken?.roles || ['ADMIN'],
              permissions: decodedToken?.permissions || []
            };
            
            console.log('✅ Utilisateur créé depuis le token:', tempUser);
            this.currentUserSubject.next(tempUser);
            
            // Retourner l'utilisateur dans un Observable (IMPORTANT: utiliser 'of' de rxjs)
            return of(tempUser);
          })
        );
      }),
      catchError((error) => {
        console.error('❌ Erreur lors du login:', error);
        // Nettoyer les tokens en cas d'erreur de login
        this.tokenService.clearTokens();
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
