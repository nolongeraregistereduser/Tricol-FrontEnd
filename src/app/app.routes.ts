import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // Route par défaut - redirection vers login
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },

  // Routes d'authentification (non protégées)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login').then((m) => m.LoginComponent),
      },
    ],
  },

  // Routes protégées (nécessitent authentification)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard/dashboard').then((m) => m.DashboardComponent),
  },

  // Route 404
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
