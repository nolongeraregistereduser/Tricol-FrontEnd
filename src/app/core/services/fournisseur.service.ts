import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fournisseur, CreateFournisseurDto, UpdateFournisseurDto } from '../models/fournisseur.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FournisseurService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}${environment.apiEndpoints.fournisseurs}`;

  /**
   * Récupère tous les fournisseurs
   */
  getAll(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(this.API_URL);
  }

  /**
   * Récupère un fournisseur par son ID
   */
  getById(id: number): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${this.API_URL}/${id}`);
  }

  /**
   * Crée un nouveau fournisseur
   */
  create(fournisseur: CreateFournisseurDto): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(this.API_URL, fournisseur);
  }

  /**
   * Met à jour un fournisseur existant
   */
  update(id: number, fournisseur: UpdateFournisseurDto): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(`${this.API_URL}/${id}`, fournisseur);
  }

  /**
   * Supprime un fournisseur
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
