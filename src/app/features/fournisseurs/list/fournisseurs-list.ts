import { Component, inject, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FournisseurService } from '../../../core/services/fournisseur.service';
import { Fournisseur } from '../../../core/models/fournisseur.model';

@Component({
  selector: 'app-fournisseurs-list',
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
  ],
  templateUrl: './fournisseurs-list.html',
  styleUrl: './fournisseurs-list.scss',
})
export class FournisseursListComponent implements OnInit, AfterViewInit {
  private fournisseurService = inject(FournisseurService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'raisonSociale',
    'contactPerson',
    'email',
    'phone',
    'city',
    'ice',
    'actions',
  ];

  dataSource = new MatTableDataSource<Fournisseur>([]);
  loading = false;
  searchControl = new FormControl('');

  ngOnInit(): void {
    this.loadFournisseurs();

    // Recherche avec debounce
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.applyFilter(value || '');
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Charge la liste des fournisseurs
   */
  loadFournisseurs(): void {
    this.loading = true;
    this.fournisseurService.getAll().subscribe({
      next: (fournisseurs) => {
        this.dataSource.data = fournisseurs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des fournisseurs:', error);
        this.snackBar.open(
          'Erreur lors du chargement des fournisseurs',
          'Fermer',
          { duration: 3000 }
        );
        this.loading = false;
      },
    });
  }

  /**
   * Applique un filtre sur le tableau
   */
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Redirige vers la page de création
   */
  createFournisseur(): void {
    this.router.navigate(['/fournisseurs/new']);
  }

  /**
   * Redirige vers la page de détails
   */
  viewFournisseur(id: number): void {
    this.router.navigate(['/fournisseurs', id]);
  }

  /**
   * Redirige vers la page d'édition
   */
  editFournisseur(id: number): void {
    this.router.navigate(['/fournisseurs', id, 'edit']);
  }

  /**
   * Supprime un fournisseur
   */
  deleteFournisseur(fournisseur: Fournisseur): void {
    if (!fournisseur.id) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: {
        name: fournisseur.raisonSociale,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.fournisseurService.delete(fournisseur.id!).subscribe({
          next: () => {
            this.snackBar.open('Fournisseur supprimé avec succès', 'Fermer', {
              duration: 3000,
            });
            this.loadFournisseurs();
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
