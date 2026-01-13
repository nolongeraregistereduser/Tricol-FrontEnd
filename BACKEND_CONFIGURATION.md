# 🔧 Configuration Backend - Guide de test d'authentification

## ✅ Configuration effectuée

L'application Angular est maintenant configurée pour se connecter à ton backend Spring Boot via des fichiers d'environnement.

## 📁 Fichiers de configuration

### `src/environments/environment.ts` (Développement)
```typescript
apiUrl: 'http://localhost:8080'  // ← URL de ton backend Spring Boot
```

### Endpoints configurés
```
POST http://localhost:8080/auth/login      → Connexion
POST http://localhost:8080/auth/refresh    → Rafraîchir le token
POST http://localhost:8080/auth/register   → Inscription (optionnel)
GET  http://localhost:8080/users/me        → Récupérer l'utilisateur connecté
```

## 🎯 Étapes pour tester l'authentification

### 1. Vérifier que ton backend Spring Boot est démarré

```bash
# Le backend doit tourner sur http://localhost:8080
# Vérifie dans les logs de ton backend qu'il est bien démarré
```

### 2. Vérifier les endpoints disponibles

Ton backend Spring Boot doit exposer ces endpoints :

#### A. Endpoint de Login
```
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "admin@tricol.com",
  "password": "password123"
}

Response attendue (200 OK):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_value",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

#### B. Endpoint Users/Me
```
GET /users/me
Authorization: Bearer <access_token>

Response attendue (200 OK):
{
  "id": 1,
  "username": "admin",
  "email": "admin@tricol.com",
  "fullName": "Administrateur TRICOL",
  "roles": ["ROLE_ADMIN"],
  "permissions": ["users.read", "users.write", "products.read", ...]
}
```

### 3. Configurer CORS dans ton backend Spring Boot

**Important** : Pour que l'application Angular puisse communiquer avec le backend, tu dois configurer CORS.

#### Option A : Configuration globale (Recommandé)

Créer ou modifier `WebConfig.java` :

```java
package com.tricol.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200") // Angular dev server
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

#### Option B : Configuration dans SecurityConfig

Dans ton `SecurityConfig.java` :

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        // ... reste de ta config
        ;
    return http.build();
}

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### 4. Tester manuellement l'API avec curl ou Postman

Avant de tester avec Angular, vérifie que ton API fonctionne :

```bash
# Test de login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tricol.com","password":"password123"}'

# Si ça marche, tu devrais recevoir un JSON avec accessToken
```

### 5. Modifier l'URL de l'API (si nécessaire)

Si ton backend n'est PAS sur `http://localhost:8080`, modifie le fichier :

**`src/environments/environment.ts`**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:9090', // ← Change le port ici
  // ...
};
```

### 6. Lancer l'application Angular

```bash
# Dans le terminal, à la racine du projet
ng serve --open
```

L'application s'ouvre sur `http://localhost:4200`

### 7. Tester la connexion

1. **Page de login** s'affiche automatiquement
2. **Entrer les credentials** de ton backend :
   - Email : `admin@tricol.com` (ou autre utilisateur de ta base)
   - Mot de passe : `password123` (selon ton backend)
3. **Cliquer "Se connecter"**

#### ✅ Résultat attendu (succès)
- Redirection vers `/dashboard`
- Affichage des informations utilisateur
- Token JWT stocké dans localStorage

#### ❌ Résultats possibles (échec)

##### A. Erreur CORS
```
Access to XMLHttpRequest at 'http://localhost:8080/auth/login' from origin 
'http://localhost:4200' has been blocked by CORS policy
```
**Solution** : Configure CORS dans ton backend (voir étape 3)

##### B. Erreur 401 Unauthorized
```
Email ou mot de passe incorrect
```
**Solution** : Vérifie que les credentials sont corrects dans ta base de données

##### C. Erreur "Impossible de se connecter au serveur"
```
Http failure response for http://localhost:8080/auth/login: 0 Unknown Error
```
**Solution** : 
- Vérifie que ton backend est démarré
- Vérifie que l'URL est correcte dans `environment.ts`
- Vérifie qu'il n'y a pas de firewall qui bloque

##### D. Erreur 404 Not Found
```
Http failure response for http://localhost:8080/auth/login: 404 Not Found
```
**Solution** : L'endpoint `/auth/login` n'existe pas dans ton backend
- Vérifie le chemin exact de ton endpoint
- Modifie `environment.ts` si nécessaire

### 8. Déboguer avec les outils navigateur

Ouvre **DevTools (F12)** :

#### A. Onglet Network
- Filtre : XHR
- Cherche la requête `login`
- Vérifie :
  - Request URL
  - Request Headers
  - Request Payload
  - Response Status
  - Response Body

#### B. Onglet Console
- Regarde les erreurs JavaScript
- Vérifie les messages d'erreur de l'AuthService

#### C. Onglet Application → Local Storage
- Après connexion réussie, vérifie que `tricol_access_token` est présent
- Copie le token et décode-le sur https://jwt.io pour vérifier son contenu

## 🔍 Vérification détaillée

### Flux complet attendu

```
1. User clique "Se connecter"
   ↓
2. Angular → POST http://localhost:8080/auth/login
   Body: { email, password }
   ↓
3. Backend vérifie credentials
   ↓
4. Backend répond: { accessToken, refreshToken, ... }
   ↓
5. Angular stocke tokens dans localStorage
   ↓
6. Angular → GET http://localhost:8080/users/me
   Headers: Authorization: Bearer <token>
   ↓
7. Backend répond: { id, username, email, roles, permissions }
   ↓
8. Angular affiche Dashboard avec infos utilisateur
```

### Vérifier chaque étape

```bash
# 1. Backend est démarré ?
curl http://localhost:8080/actuator/health
# ou
curl http://localhost:8080

# 2. Endpoint login existe ?
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'

# 3. Token JWT valide ?
# Copie le token de la réponse et colle-le sur https://jwt.io
```

## 📝 Checklist de configuration

- [ ] Backend Spring Boot démarré sur port 8080
- [ ] Endpoint `/auth/login` fonctionne (test curl/Postman)
- [ ] Endpoint `/users/me` fonctionne (avec token)
- [ ] CORS configuré dans le backend
- [ ] URL de l'API correcte dans `environment.ts`
- [ ] Angular dev server lancé (`ng serve`)
- [ ] Page de login accessible sur `http://localhost:4200`
- [ ] Credentials de test prêts (user dans la base)

## 🎯 Si l'authentification fonctionne

Après connexion réussie, tu verras :
- ✅ Dashboard avec message de bienvenue
- ✅ Nom d'utilisateur affiché
- ✅ Email affiché
- ✅ Rôles affichés
- ✅ Bouton "Se déconnecter" visible

Tu peux ensuite :
1. Tester la déconnexion (bouton logout)
2. Tester la protection des routes (accéder à `/dashboard` sans être connecté)
3. Vérifier le refresh automatique du token (attendre l'expiration)

## 🆘 Besoin d'aide ?

Si ça ne fonctionne pas, fournis-moi :
1. Les logs de ton backend Spring Boot (erreurs)
2. Les erreurs dans la console navigateur (F12)
3. Le contenu de l'onglet Network pour la requête `/auth/login`
4. La structure exacte de tes endpoints backend

---

**Prochaine étape** : Une fois l'authentification testée et fonctionnelle, on pourra créer les modules suivants (Produits, Fournisseurs, Stock, etc.)

