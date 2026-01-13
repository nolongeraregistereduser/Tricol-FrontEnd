# 🏢 TRICOL Frontend - Gestion des Approvisionnements et Stocks

Application Angular 20 pour la gestion des approvisionnements, stocks (méthode FIFO), et bons de sortie de l'entreprise TRICOL.

## 📋 Statut du projet

✅ **Authentification JWT complète** - Prête à tester avec le backend Spring Boot

## 🚀 Démarrage rapide

### Prérequis
- Node.js v20+
- npm v11+
- Backend Spring Boot accessible

### Installation
```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
ng serve --open
```

L'application s'ouvre automatiquement sur **http://localhost:4200**

## ⚙️ Configuration Backend

**Par défaut**, l'app se connecte à : `http://localhost:8080`

**Pour modifier l'URL** :
1. Ouvre `src/environments/environment.ts`
2. Modifie la ligne `apiUrl: 'http://localhost:XXXX'`
3. Sauvegarde (l'app se recharge automatiquement)

### Configurer CORS dans Spring Boot

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("*")
                .allowedHeaders("*");
    }
}
```

## 🎯 Fonctionnalités implémentées

### ✅ Module Authentification
- [x] Page de login (Material Design)
- [x] AuthService (login, logout, refresh)
- [x] TokenService (gestion JWT)
- [x] AuthInterceptor (ajout automatique du token)
- [x] AuthGuard (protection des routes)
- [x] Refresh automatique du token
- [x] Redirection intelligente

### 🚧 À venir (prochaines étapes)
- [ ] Module Produits (CRUD, alertes stock)
- [ ] Module Fournisseurs (CRUD)
- [ ] Module Commandes (création, validation, réception)
- [ ] Module Stock (lots, FIFO, valorisation)
- [ ] Module Bons de Sortie (création, validation)
- [ ] Module Admin (users, roles, permissions)
- [ ] Dashboard KPI

## 📁 Structure du projet

```
src/app/
├── core/                        # Services singleton, guards, interceptors
│   ├── services/
│   │   ├── auth.ts             # ✅ Service authentification
│   │   └── token.ts            # ✅ Gestion tokens JWT
│   ├── interceptors/
│   │   └── auth-interceptor.ts # ✅ Ajout auto token + refresh
│   ├── guards/
│   │   └── auth-guard.ts       # ✅ Protection routes
│   └── models/                  # Interfaces TypeScript
│
├── features/                    # Modules fonctionnels
│   ├── auth/login/             # ✅ Page connexion
│   └── dashboard/dashboard/    # ✅ Dashboard protégé
│
├── app.routes.ts               # Configuration routes
└── app.config.ts               # Configuration app
```

## 📖 Documentation

| Fichier | Description |
|---------|-------------|
| **START_HERE.md** | 🎯 Guide ultra-rapide pour commencer |
| **TEST_AUTH.md** | 🧪 Guide test authentification (3 min) |
| **BACKEND_CONFIGURATION.md** | 🔧 Configuration backend détaillée |
| **AUTH_IMPLEMENTATION.md** | 📚 Documentation technique auth |
| **IMPLEMENTATION_PLAN.md** | 📋 Roadmap complète du projet |
| **QUICKSTART.md** | 🚀 Guide de démarrage complet |

## 🧪 Tester l'authentification

### 1. Backend démarré
```bash
curl http://localhost:8080
```

### 2. Lance Angular
```bash
ng serve --open
```

### 3. Teste la connexion
- Page de login s'affiche
- Entre tes credentials backend
- Clique "Se connecter"
- ✅ Dashboard affiché si succès

## 🛠️ Scripts disponibles

```bash
# Développement
ng serve                    # Démarrer dev server
ng serve --open            # Démarrer + ouvrir navigateur

# Build
ng build                    # Build de développement
ng build --configuration production  # Build de production

# Tests
ng test                     # Tests unitaires
ng lint                     # Linter

# Génération
ng generate component nom   # Nouveau composant
ng generate service nom     # Nouveau service
ng generate module nom      # Nouveau module
```

## 🔐 Endpoints Backend requis

```
POST /auth/login       → Connexion (email, password)
POST /auth/refresh     → Refresh token
GET  /users/me         → Infos utilisateur connecté
```

## 🎨 Stack Technique

- **Framework** : Angular 20
- **UI Library** : Angular Material
- **Forms** : Reactive Forms
- **HTTP** : HttpClient + Interceptors
- **Routing** : Angular Router + Guards
- **Auth** : JWT (localStorage)
- **Notifications** : ngx-toastr

## 🐛 Débogage

### Console navigateur (F12)
- **Console** : Erreurs JavaScript
- **Network** : Requêtes HTTP
- **Application → Local Storage** : Tokens JWT

### Vérifier le token
1. Connecte-toi
2. Ouvre DevTools → Application → Local Storage
3. Copie `tricol_access_token`
4. Décode sur https://jwt.io

## 🆘 Problèmes courants

### ❌ Erreur CORS
```
Access-Control-Allow-Origin blocked
```
→ Configure CORS dans Spring Boot (voir ci-dessus)

### ❌ "Impossible de se connecter"
```
Http failure response: 0 Unknown Error
```
→ Backend pas démarré OU mauvaise URL dans `environment.ts`

### ❌ Erreur 401
```
Email ou mot de passe incorrect
```
→ Vérifie les credentials dans la base de données

### ❌ Erreur 404
```
404 Not Found /auth/login
```
→ Endpoint différent dans le backend ? Modifie `environment.ts`

## 📦 Build & Déploiement

### Build de production
```bash
ng build --configuration production
```

Les fichiers optimisés sont dans `dist/tricol-frontend/`

### Docker (à venir)
```dockerfile
# Dockerfile multi-stage avec Nginx
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=build /app/dist/tricol-frontend /usr/share/nginx/html
```

## 🤝 Contribution

Modules à développer (ordre suggéré) :
1. **Produits** : CRUD + alertes stock
2. **Fournisseurs** : CRUD
3. **Stock** : Lots, FIFO, valorisation
4. **Commandes** : Création, validation, réception
5. **Bons de Sortie** : Création, validation
6. **Admin** : Users, roles, permissions
7. **Dashboard** : KPI temps réel

## 📄 Licence

Propriété de TRICOL - 2025

## 📞 Support

Consulte la documentation dans les fichiers `.md` à la racine du projet.

---

**Status** : ✅ Authentification fonctionnelle - Prêt à tester avec le backend

**Version** : 1.0.0-auth-mvp

