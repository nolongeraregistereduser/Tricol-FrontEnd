import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  hidePassword = true;
  registrationSuccess = false;

  ngOnInit(): void {
    // Initialiser le formulaire
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    
    // Vérifier si l'utilisateur vient de s'inscrire
    const registered = this.route.snapshot.queryParams['registered'];
    const username = this.route.snapshot.queryParams['username'];
    
    if (registered === 'true') {
      this.registrationSuccess = true;
      // Pré-remplir le username si fourni
      if (username) {
        this.loginForm.patchValue({ username });
      }
    }
  }

  /**
   * Soumission du formulaire de login
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (user) => {
        this.loading = false;
        console.log('✅ Authentification réussie, utilisateur:', user);
        // Rediriger vers le dashboard approprié selon le rôle
        const dashboardRoute = this.getDashboardRoute(user.roles);
        console.log('🚀 Redirection vers:', dashboardRoute);
        this.router.navigate([dashboardRoute]);
      },
      error: (error) => {
        this.loading = false;
        console.error('❌ Erreur d\'authentification:', error);
        
        // Erreur de login
        if (error.status === 401) {
          this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur';
        } else if (error.status === 400) {
          this.errorMessage = 'Données de connexion invalides';
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    });
  }

  /**
   * Détermine la route du dashboard selon le rôle de l'utilisateur
   */
  private getDashboardRoute(roles: string[]): string {
    // L'utilisateur peut avoir plusieurs rôles, on prend le premier dans l'ordre de priorité
    if (roles.includes('ADMIN')) {
      return '/dashboard/admin';
    } else if (roles.includes('RESPONSABLE_ACHATS')) {
      return '/dashboard/responsable-achats';
    } else if (roles.includes('MAGASINIER')) {
      return '/dashboard/magasinier';
    } else if (roles.includes('CHEF_ATELIER')) {
      return '/dashboard/chef-atelier';
    }
    // Par défaut, rediriger vers le dashboard admin
    return '/dashboard/admin';
  }

  /**
   * Récupère les erreurs de validation pour un champ
   */
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Minimum ${minLength} caractères requis`;
    }
    return '';
  }
}
