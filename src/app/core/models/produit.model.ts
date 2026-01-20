/**
 * Catégories de produits
 */
export enum CategoryProduit {
  MATIERE_PREMIERE = 'MATIERE_PREMIERE',
  PRODUIT_FINI = 'PRODUIT_FINI',
  EMBALLAGE = 'EMBALLAGE',
  FOURNITURE = 'FOURNITURE',
}

/**
 * Unités de mesure
 */
export enum UniteMesure {
  PIECE = 'PIECE',
  KILOGRAMME = 'KILOGRAMME',
  LITRE = 'LITRE',
  METRE = 'METRE',
  METRE_CARRE = 'METRE_CARRE',
  METRE_CUBE = 'METRE_CUBE',
  BOITE = 'BOITE',
  CARTON = 'CARTON',
}

/**
 * Modèle pour un Produit
 */
export interface Produit {
  id?: number;
  reference: string;
  name: string;
  description: string;
  unitPrice: number;
  category: CategoryProduit | string;
  reorderPoint: number;
  unitOfMeasure: UniteMesure | string;
}

/**
 * DTO pour créer un produit
 */
export interface CreateProduitDto {
  reference: string;
  name: string;
  description: string;
  unitPrice: number;
  category: CategoryProduit | string;
  reorderPoint: number;
  unitOfMeasure: UniteMesure | string;
}

/**
 * DTO pour mettre à jour un produit
 */
export interface UpdateProduitDto {
  reference: string;
  name: string;
  description: string;
  unitPrice: number;
  category: CategoryProduit | string;
  reorderPoint: number;
  unitOfMeasure: UniteMesure | string;
}

/**
 * Options pour les sélecteurs de formulaire
 */
export const CATEGORY_OPTIONS = [
  { value: CategoryProduit.MATIERE_PREMIERE, label: 'Matière Première' },
  { value: CategoryProduit.PRODUIT_FINI, label: 'Produit Fini' },
  { value: CategoryProduit.EMBALLAGE, label: 'Emballage' },
  { value: CategoryProduit.FOURNITURE, label: 'Fourniture' },
];

export const UNIT_OPTIONS = [
  { value: UniteMesure.PIECE, label: 'Pièce' },
  { value: UniteMesure.KILOGRAMME, label: 'Kilogramme' },
  { value: UniteMesure.LITRE, label: 'Litre' },
  { value: UniteMesure.METRE, label: 'Mètre' },
  { value: UniteMesure.METRE_CARRE, label: 'Mètre Carré' },
  { value: UniteMesure.METRE_CUBE, label: 'Mètre Cube' },
  { value: UniteMesure.BOITE, label: 'Boîte' },
  { value: UniteMesure.CARTON, label: 'Carton' },
];
