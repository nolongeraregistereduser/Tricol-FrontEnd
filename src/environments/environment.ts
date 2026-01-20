// Environnement de développement
export const environment = {
  production: false,
  apiUrl: 'http://localhost:9091', // Backend Spring Boot sur port 9091
  apiEndpoints: {
    auth: '/api/auth',    // POST /api/auth/login, /api/auth/refresh, /api/auth/register
    users: '/api/users',  // GET /api/users/me
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

