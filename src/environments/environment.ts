// Environnement de développement
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080', // ← Modifie cette URL selon ton backend Spring Boot
  apiEndpoints: {
    auth: '/auth',        // POST /auth/login, /auth/refresh, /auth/register
    users: '/users',      // GET /users/me
    products: '/api/products',
    suppliers: '/api/suppliers',
    orders: '/api/orders',
    stock: '/api/stocks',
    lots: '/api/lots',
    movements: '/api/movements',
    bonsSortie: '/api/bons-sortie',
  }
};

