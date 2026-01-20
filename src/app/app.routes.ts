import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // Route par défaut - redirection vers login seulement si non authentifié
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
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register').then((m) => m.RegisterComponent),
      },
    ],
  },

  // Routes protégées (nécessitent authentification)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    children: [
      {
        path: 'admin',
        loadComponent: () =>
          import('./features/dashboard/admin/admin-dashboard').then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'responsable-achats',
        loadComponent: () =>
          import('./features/dashboard/responsable-achats/responsable-achats-dashboard').then((m) => m.ResponsableAchatsDashboardComponent),
      },
      {
        path: 'magasinier',
        loadComponent: () =>
          import('./features/dashboard/magasinier/magasinier-dashboard').then((m) => m.MagasinierDashboardComponent),
      },
      {
        path: 'chef-atelier',
        loadComponent: () =>
          import('./features/dashboard/chef-atelier/chef-atelier-dashboard').then((m) => m.ChefAtelierDashboardComponent),
      },
      // Fallback route for /dashboard
      {
        path: '',
        redirectTo: 'admin',
        pathMatch: 'full'
      }
    ]
  },

  // Module Gestion des Fournisseurs
  {
    path: 'fournisseurs',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/fournisseurs/list/fournisseurs-list').then((m) => m.FournisseursListComponent),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./features/fournisseurs/form/fournisseur-form').then((m) => m.FournisseurFormComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/fournisseurs/detail/fournisseur-detail').then((m) => m.FournisseurDetailComponent),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./features/fournisseurs/form/fournisseur-form').then((m) => m.FournisseurFormComponent),
      },
    ],
  },

  // Route 404
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
