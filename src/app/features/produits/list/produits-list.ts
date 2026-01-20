import { Component, inject, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProduitService } from '../../../core/services/produit.service';
import { Produit, CategoryProduit, CATEGORY_OPTIONS } from '../../../core/models/produit.model';

@Component({
  selector: 'app-produits-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatTooltipModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
  ],
  templateUrl: './produits-list.html',
  styleUrl: './produits-list.scss',
})
export class ProduitsListComponent implements OnInit, AfterViewInit {
  private produitService = inject(ProduitService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'reference',
    'name',
    'category',
    'unitPrice',
    'reorderPoint',
    'unitOfMeasure',
    'actions',
  ];

  dataSource = new MatTableDataSource<Produit>([]);
  loading = false;
  searchControl = new FormControl('');
  categoryFilter = new FormControl('');
  categoryOptions = CATEGORY_OPTIONS;

  ngOnInit(): void {
    this.loadProduits();

    // Recherche avec debounce
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.applyFilter(value || '');
      });

    // Filtre par catégorie
    this.categoryFilter.valueChanges.subscribe(() => {
      const searchValue = this.searchControl.value || '';
      this.applyFilter(searchValue);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Charge la liste des produits
   */
  loadProduits(): void {
    this.loading = true;
    this.produitService.getAll().subscribe({
      next: (produits) => {
        this.dataSource.data = produits;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
        
        let errorMessage = 'Erreur lors du chargement des produits';
        if (error.status === 404) {
          errorMessage = 'Endpoint produits non trouvé. Vérifiez la configuration de l\'API.';
        } else if (error.status === 401) {
          errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
        } else if (error.status === 0) {
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
        }
        
        this.snackBar.open(errorMessage, 'Fermer', { duration: 5000 });
        this.loading = false;
      },
    });
  }

  /**
   * Applique un filtre sur le tableau
   */
  applyFilter(filterValue: string): void {
    // Définir le filterPredicate pour gérer la recherche et la catégorie
    this.dataSource.filterPredicate = (data: Produit, filter: string) => {
      const searchStr = filter.toLowerCase();
      const matchesSearch = 
        data.reference.toLowerCase().includes(searchStr) ||
        data.name.toLowerCase().includes(searchStr) ||
        (data.description?.toLowerCase().includes(searchStr) ?? false);

      const categoryFilter = this.categoryFilter.value;
      const matchesCategory = !categoryFilter || data.category === categoryFilter;

      return matchesSearch && matchesCategory;
    };

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Réinitialise les filtres
   */
  clearFilters(): void {
    this.searchControl.setValue('');
    this.categoryFilter.setValue('');
    this.applyFilter('');
  }

  /**
   * Redirige vers la page de création
   */
  createProduit(): void {
    this.router.navigate(['/produits/new']);
  }

  /**
   * Redirige vers la page de détails
   */
  viewProduit(id: number): void {
    this.router.navigate(['/produits', id]);
  }

  /**
   * Redirige vers la page d'édition
   */
  editProduit(id: number): void {
    this.router.navigate(['/produits', id, 'edit']);
  }

  /**
   * Supprime un produit
   */
  deleteProduit(produit: Produit): void {
    if (!produit.id) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: {
        name: produit.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.produitService.delete(produit.id!).subscribe({
          next: () => {
            this.snackBar.open('Produit supprimé avec succès', 'Fermer', {
              duration: 3000,
            });
            this.loadProduits();
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
