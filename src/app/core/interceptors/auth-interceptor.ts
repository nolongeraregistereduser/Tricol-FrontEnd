import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from '../services/token';
import { AuthService } from '../services/auth';

/**
 * Intercepteur d'authentification
 * - Ajoute automatiquement le token JWT à chaque requête
 * - Gère le refresh automatique du token en cas de 401
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  // Récupérer le token
  const token = tokenService.getAccessToken();

  // Ne pas ajouter le token aux requêtes de login, register et refresh
  const excludedUrls = ['/auth/login', '/auth/register', '/auth/refresh'];
  const shouldExclude = excludedUrls.some(url => req.url.includes(url));

  // Cloner la requête et ajouter le header Authorization si token présent
  let authReq = req;
  if (token && !shouldExclude) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Envoyer la requête et gérer les erreurs 401
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si erreur 401 (non autorisé), tenter de refresh le token
      // Mais seulement si ce n'est pas une requête de login/register/refresh
      const isAuthEndpoint = excludedUrls.some(url => req.url.includes(url));
      
      if (error.status === 401 && !isAuthEndpoint && tokenService.getRefreshToken()) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Réessayer la requête avec le nouveau token
            const newToken = tokenService.getAccessToken();
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              },
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            // Si le refresh échoue, déconnecter l'utilisateur
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      // Pour les erreurs 401 sur login/register, ne pas essayer de refresh
      return throwError(() => error);
    })
  );
};
