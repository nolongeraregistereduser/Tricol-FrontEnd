import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { FournisseurService } from '../../../core/services/fournisseur.service';
import { Fournisseur } from '../../../core/models/fournisseur.model';

@Component({
  selector: 'app-fournisseur-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule,
  ],
  templateUrl: './fournisseur-detail.html',
  styleUrl: './fournisseur-detail.scss',
})
export class FournisseurDetailComponent implements OnInit {
  private fournisseurService = inject(FournisseurService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  fournisseur: Fournisseur | null = null;
  loading = false;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.loadFournisseur(+id);
      }
    });
  }

  /**
   * Charge les détails du fournisseur
   */
  loadFournisseur(id: number): void {
    this.loading = true;
    this.fournisseurService.getById(id).subscribe({
      next: (fournisseur) => {
        this.fournisseur = fournisseur;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du fournisseur:', error);
        this.snackBar.open(
          'Erreur lors du chargement du fournisseur',
          'Fermer',
          { duration: 3000 }
        );
        this.loading = false;
        this.router.navigate(['/fournisseurs']);
      },
    });
  }

  /**
   * Redirige vers la page d'édition
   */
  editFournisseur(): void {
    if (this.fournisseur?.id) {
      this.router.navigate(['/fournisseurs', this.fournisseur.id, 'edit']);
    }
  }

  /**
   * Supprime le fournisseur
   */
  deleteFournisseur(): void {
    if (!this.fournisseur?.id) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: {
        name: this.fournisseur.raisonSociale,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.fournisseurService.delete(this.fournisseur!.id!).subscribe({
          next: () => {
            this.snackBar.open('Fournisseur supprimé avec succès', 'Fermer', {
              duration: 3000,
            });
            this.router.navigate(['/fournisseurs']);
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.snackBar.open(
              'Erreur lors de la suppression du fournisseur',
              'Fermer',
              { duration: 3000 }
            );
            this.loading = false;
          },
        });
      }
    });
  }

  /**
   * Retourne à la liste
   */
  goBack(): void {
    this.router.navigate(['/fournisseurs']);
  }
}

/**
 * Composant de dialogue de confirmation de suppression
 */
@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirmer la suppression</h2>
    <mat-dialog-content>
      <p>Êtes-vous sûr de vouloir supprimer le fournisseur <strong>{{ data.name }}</strong> ?</p>
      <p class="warning">Cette action est irréversible.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Annuler</button>
      <button mat-button [mat-dialog-close]="true" color="warn">Supprimer</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .warning {
      color: #f44336;
      font-size: 0.9em;
      margin-top: 10px;
    }
  `],
})
export class ConfirmDeleteDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string }) {}
}
