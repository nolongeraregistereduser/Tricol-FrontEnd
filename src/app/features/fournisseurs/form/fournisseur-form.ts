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
import { FournisseurService } from '../../../core/services/fournisseur.service';
import { Fournisseur } from '../../../core/models/fournisseur.model';

@Component({
  selector: 'app-fournisseur-form',
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
  ],
  templateUrl: './fournisseur-form.html',
  styleUrl: './fournisseur-form.scss',
})
export class FournisseurFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private fournisseurService = inject(FournisseurService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  fournisseurForm!: FormGroup;
  loading = false;
  isEditMode = false;
  fournisseurId: number | null = null;

  ngOnInit(): void {
    // Vérifier si on est en mode édition
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.fournisseurId = +id;
        this.loadFournisseur(this.fournisseurId);
      } else {
        this.initForm();
      }
    });
  }

  /**
   * Initialise le formulaire
   */
  initForm(fournisseur?: Fournisseur): void {
    this.fournisseurForm = this.fb.group({
      raisonSociale: [
        fournisseur?.raisonSociale || '',
        [Validators.required, Validators.minLength(3)],
      ],
      address: [
        fournisseur?.address || '',
        [Validators.required, Validators.minLength(5)],
      ],
      city: [
        fournisseur?.city || '',
        [Validators.required, Validators.minLength(2)],
      ],
      ice: [
        fournisseur?.ice || '',
        [
          Validators.required,
          Validators.pattern(/^\d{15}$/),
        ],
      ],
      contactPerson: [
        fournisseur?.contactPerson || '',
        [Validators.required, Validators.minLength(2)],
      ],
      email: [
        fournisseur?.email || '',
        [Validators.required, Validators.email],
      ],
      phone: [
        fournisseur?.phone || '',
        [
          Validators.required,
          Validators.pattern(/^[0-9+\-\s()]+$/),
        ],
      ],
    });
  }

  /**
   * Charge un fournisseur pour l'édition
   */
  loadFournisseur(id: number): void {
    this.loading = true;
    this.fournisseurService.getById(id).subscribe({
      next: (fournisseur) => {
        this.initForm(fournisseur);
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
   * Soumission du formulaire
   */
  onSubmit(): void {
    if (this.fournisseurForm.invalid) {
      this.markFormGroupTouched(this.fournisseurForm);
      return;
    }

    this.loading = true;
    const formValue = this.fournisseurForm.value;

    if (this.isEditMode && this.fournisseurId) {
      // Mode édition
      this.fournisseurService.update(this.fournisseurId, formValue).subscribe({
        next: () => {
          this.snackBar.open('Fournisseur modifié avec succès', 'Fermer', {
            duration: 3000,
          });
          this.router.navigate(['/fournisseurs']);
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          this.snackBar.open(
            'Erreur lors de la modification du fournisseur',
            'Fermer',
            { duration: 3000 }
          );
          this.loading = false;
        },
      });
    } else {
      // Mode création
      this.fournisseurService.create(formValue).subscribe({
        next: () => {
          this.snackBar.open('Fournisseur créé avec succès', 'Fermer', {
            duration: 3000,
          });
          this.router.navigate(['/fournisseurs']);
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.snackBar.open(
            'Erreur lors de la création du fournisseur',
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
    this.router.navigate(['/fournisseurs']);
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
    const field = this.fournisseurForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Minimum ${minLength} caractères requis`;
    }
    if (field?.hasError('email')) {
      return 'Email invalide';
    }
    if (field?.hasError('pattern')) {
      if (fieldName === 'ice') {
        return 'ICE doit contenir exactement 15 chiffres';
      }
      if (fieldName === 'phone') {
        return 'Format de téléphone invalide';
      }
    }
    return '';
  }
}
