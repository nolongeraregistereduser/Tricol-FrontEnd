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
import { ProduitService } from '../../../core/services/produit.service';
import { Produit, CATEGORY_OPTIONS, UNIT_OPTIONS } from '../../../core/models/produit.model';

@Component({
  selector: 'app-produit-detail',
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
  templateUrl: './produit-detail.html',
  styleUrl: './produit-detail.scss',
})
export class ProduitDetailComponent implements OnInit {
  private produitService = inject(ProduitService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  produit: Produit | null = null;
  loading = false;
  categoryOptions = CATEGORY_OPTIONS;
  unitOptions = UNIT_OPTIONS;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.loadProduit(+id);
      }
    });
  }

  /**
   * Charge les détails du produit
   */
  loadProduit(id: number): void {
    this.loading = true;
    this.produitService.getById(id).subscribe({
      next: (produit) => {
        this.produit = produit;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du produit:', error);
        this.snackBar.open(
          'Erreur lors du chargement du produit',
          'Fermer',
          { duration: 3000 }
        );
        this.loading = false;
        this.router.navigate(['/produits']);
      },
    });
  }

  /**
   * Redirige vers la page d'édition
   */
  editProduit(): void {
    if (this.produit?.id) {
      this.router.navigate(['/produits', this.produit.id, 'edit']);
    }
  }

  /**
   * Supprime le produit
   */
  deleteProduit(): void {
    if (!this.produit?.id) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: {
        name: this.produit.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.produitService.delete(this.produit!.id!).subscribe({
          next: () => {
            this.snackBar.open('Produit supprimé avec succès', 'Fermer', {
              duration: 3000,
            });
            this.router.navigate(['/produits']);
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.snackBar.open(
              'Erreur lors de la suppression du produit',
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
    this.router.navigate(['/produits']);
  }

  /**
   * Formate le prix
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
    }).format(price);
  }

  /**
   * Obtient le libellé de la catégorie
   */
  getCategoryLabel(category: string): string {
    const option = this.categoryOptions.find(opt => opt.value === category);
    return option ? option.label : category;
  }

  /**
   * Obtient le libellé de l'unité de mesure
   */
  getUnitLabel(unit: string): string {
    const option = this.unitOptions.find(opt => opt.value === unit);
    return option ? option.label : unit;
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
      <p>Êtes-vous sûr de vouloir supprimer le produit <strong>{{ data.name }}</strong> ?</p>
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
