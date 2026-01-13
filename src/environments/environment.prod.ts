// Environnement de production
export const environment = {
  production: true,
  apiUrl: 'https://api.tricol.com', // ← URL de production (à configurer)
  apiEndpoints: {
    auth: '/auth',
    users: '/users',
    products: '/api/products',
    suppliers: '/api/suppliers',
    orders: '/api/orders',
    stock: '/api/stocks',
    lots: '/api/lots',
    movements: '/api/movements',
    bonsSortie: '/api/bons-sortie',
  }
};

