import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { ProduitService } from '../../../core/services/produit.service';
import { Produit, CategoryProduit, UniteMesure, CATEGORY_OPTIONS, UNIT_OPTIONS } from '../../../core/models/produit.model';

@Component({
  selector: 'app-produit-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
  ],
  templateUrl: './produit-form.html',
  styleUrl: './produit-form.scss',
})
export class ProduitFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private produitService = inject(ProduitService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  produitForm!: FormGroup;
  loading = false;
  isEditMode = false;
  produitId: number | null = null;
  categoryOptions = CATEGORY_OPTIONS;
  unitOptions = UNIT_OPTIONS;

  ngOnInit(): void {
    // Vérifier si on est en mode édition
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.produitId = +id;
        this.loadProduit(this.produitId);
      } else {
        this.initForm();
      }
    });
  }

  /**
   * Initialise le formulaire
   */
  initForm(produit?: Produit): void {
    this.produitForm = this.fb.group({
      reference: [
        produit?.reference || '',
        [Validators.required, Validators.minLength(3)],
      ],
      name: [
        produit?.name || '',
        [Validators.required, Validators.minLength(3)],
      ],
      description: [
        produit?.description || '',
        [Validators.required, Validators.minLength(10)],
      ],
      unitPrice: [
        produit?.unitPrice || 0,
        [Validators.required, Validators.min(0.01)],
      ],
      category: [
        produit?.category || CategoryProduit.MATIERE_PREMIERE,
        [Validators.required],
      ],
      reorderPoint: [
        produit?.reorderPoint || 0,
        [Validators.required, Validators.min(0)],
      ],
      unitOfMeasure: [
        produit?.unitOfMeasure || UniteMesure.PIECE,
        [Validators.required],
      ],
    });
  }

  /**
   * Charge un produit pour l'édition
   */
  loadProduit(id: number): void {
    this.loading = true;
    this.produitService.getById(id).subscribe({
      next: (produit) => {
        this.initForm(produit);
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
   * Soumission du formulaire
   */
  onSubmit(): void {
    if (this.produitForm.invalid) {
      this.markFormGroupTouched(this.produitForm);
      return;
    }

    this.loading = true;
    const formValue = this.produitForm.value;

    if (this.isEditMode && this.produitId) {
      // Mode édition
      this.produitService.update(this.produitId, formValue).subscribe({
        next: () => {
          this.snackBar.open('Produit modifié avec succès', 'Fermer', {
            duration: 3000,
          });
          this.router.navigate(['/produits']);
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          this.snackBar.open(
            'Erreur lors de la modification du produit',
            'Fermer',
            { duration: 3000 }
          );
          this.loading = false;
        },
      });
    } else {
      // Mode création
      this.produitService.create(formValue).subscribe({
        next: () => {
          this.snackBar.open('Produit créé avec succès', 'Fermer', {
            duration: 3000,
          });
          this.router.navigate(['/produits']);
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.snackBar.open(
            'Erreur lors de la création du produit',
            'Fermer',
            { duration: 3000 }
          );
          this.loading = false;
        },
      });
    }
  }

  /**
   * Annule et retourne à la liste
   */
  cancel(): void {
    this.router.navigate(['/produits']);
  }

  /**
   * Marque tous les champs comme touchés pour afficher les erreurs
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Récupère le message d'erreur pour un champ
   */
  getErrorMessage(fieldName: string): string {
    const field = this.produitForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Minimum ${minLength} caractères requis`;
    }
    if (field?.hasError('min')) {
      return 'La valeur doit être supérieure à 0';
    }
    return '';
  }

  /**
   * Formate le prix pour l'affichage
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
    }).format(price);
  }
}
