import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit, CreateProduitDto, UpdateProduitDto } from '../models/produit.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}${environment.apiEndpoints.products}`;

  /**
   * Récupère tous les produits
   */
  getAll(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.API_URL);
  }

  /**
   * Récupère un produit par son ID
   */
  getById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.API_URL}/${id}`);
  }

  /**
   * Crée un nouveau produit
   */
  create(produit: CreateProduitDto): Observable<Produit> {
    return this.http.post<Produit>(this.API_URL, produit);
  }

  /**
   * Met à jour un produit existant
   */
  update(id: number, produit: UpdateProduitDto): Observable<Produit> {
    return this.http.put<Produit>(`${this.API_URL}/${id}`, produit);
  }

  /**
   * Supprime un produit
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
