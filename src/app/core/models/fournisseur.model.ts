/**
 * Modèle pour un Fournisseur (Supplier)
 */
export interface Fournisseur {
  id?: number;
  raisonSociale: string;
  address: string;
  city: string;
  ice: string;
  contactPerson: string;
  email: string;
  phone: string;
}

/**
 * DTO pour créer un fournisseur
 */
export interface CreateFournisseurDto {
  raisonSociale: string;
  address: string;
  city: string;
  ice: string;
  contactPerson: string;
  email: string;
  phone: string;
}

/**
 * DTO pour mettre à jour un fournisseur
 */
export interface UpdateFournisseurDto {
  raisonSociale: string;
  address: string;
  city: string;
  ice: string;
  contactPerson: string;
  email: string;
  phone: string;
}
