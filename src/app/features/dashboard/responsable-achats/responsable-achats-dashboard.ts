import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-responsable-achats-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dashboard-container">
      <mat-card class="dashboard-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon class="role-icon">shopping_cart</mat-icon>
            <h1>Hello RESPONSABLE ACHATS</h1>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div class="welcome-section" *ngIf="currentUser">
            <p class="welcome-text">Bienvenue, <strong>{{ currentUser.username }}</strong></p>
            <p class="role-description">Gestion des commandes et des fournisseurs</p>
            
            <div class="user-info">
              <p><mat-icon>person</mat-icon> <strong>Utilisateur:</strong> {{ currentUser.username }}</p>
              <p *ngIf="currentUser.email"><mat-icon>email</mat-icon> <strong>Email:</strong> {{ currentUser.email }}</p>
              <p *ngIf="currentUser.fullName"><mat-icon>badge</mat-icon> <strong>Nom complet:</strong> {{ currentUser.fullName }}</p>
              <p><mat-icon>verified_user</mat-icon> <strong>Rôle:</strong> RESPONSABLE ACHATS</p>
            </div>
          </div>

          <div class="loading" *ngIf="!currentUser">
            <p>Chargement des informations...</p>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="warn" (click)="logout()">
            <mat-icon>logout</mat-icon>
            Se déconnecter
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      padding: 20px;
    }

    .dashboard-card {
      width: 100%;
      max-width: 600px;
      padding: 30px;
    }

    mat-card-header {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;

      mat-card-title {
        display: flex;
        align-items: center;
        gap: 15px;
        
        .role-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          color: #38f9d7;
        }

        h1 {
          margin: 0;
          font-size: 2rem;
          color: #333;
        }
      }
    }

    .welcome-section {
      .welcome-text {
        font-size: 1.2rem;
        margin-bottom: 10px;
      }

      .role-description {
        color: #666;
        margin-bottom: 30px;
        font-size: 1rem;
      }

      .user-info {
        background: #f5f5f5;
        padding: 20px;
        border-radius: 8px;
        
        p {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 10px 0;
          
          mat-icon {
            color: #38f9d7;
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }
      }
    }

    mat-card-actions {
      display: flex;
      justify-content: center;
      padding-top: 20px;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
    }
  `]
})
export class ResponsableAchatsDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  currentUser: User | null = null;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}

