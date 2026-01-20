// Environnement de production
export const environment = {
  production: true,
  apiUrl: 'https://api.tricol.com', // ← URL de production (à configurer)
  apiEndpoints: {
    auth: '/api/auth',
    users: '/api/users',
    products: '/api/v1/produits',  // CRUD Produits
    suppliers: '/api/suppliers',
    fournisseurs: '/api/v1/fournisseurs',  // CRUD Fournisseurs
    orders: '/api/orders',
    stock: '/api/stocks',
    lots: '/api/lots',
    movements: '/api/movements',
    bonsSortie: '/api/bons-sortie',
  }
};

