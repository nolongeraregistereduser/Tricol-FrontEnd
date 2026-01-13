# 🚀 Guide Rapide - Tester l'Authentification

## Configuration actuelle

**URL Backend** : `http://localhost:8080`

Si ton backend Spring Boot tourne sur un autre port (ex: 9090, 8081), modifie :
- `src/environments/environment.ts` → ligne `apiUrl`

## 🎯 Étapes pour tester (3 minutes)

### 1. Assure-toi que ton backend tourne
```bash
# Vérifie que Spring Boot est démarré
curl http://localhost:8080
```

### 2. Configure CORS dans ton backend

**Dans SecurityConfig.java ou WebConfig.java** :
```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOrigins("http://localhost:4200")
            .allowedMethods("*")
            .allowedHeaders("*");
}
```

### 3. Lance Angular
```bash
ng serve --open
```

### 4. Teste la connexion
- Email : utilise un utilisateur de ta base
- Password : le mot de passe correspondant
- Clique "Se connecter"

## ✅ Si ça marche
- Tu verras le Dashboard avec tes infos utilisateur
- Token JWT stocké dans localStorage
- Bouton "Se déconnecter" fonctionne

## ❌ Si ça ne marche pas

### Erreur CORS
```
Access-Control-Allow-Origin
```
→ Configure CORS dans ton backend (voir étape 2)

### Erreur 401
```
Email ou mot de passe incorrect
```
→ Vérifie les credentials dans ta base de données

### Erreur "Impossible de se connecter"
```
Http failure response: 0 Unknown Error
```
→ Backend pas démarré ou mauvais port dans `environment.ts`

### Erreur 404
```
404 Not Found /auth/login
```
→ Vérifie que ton endpoint est bien `/auth/login` dans le backend
→ Si différent, modifie `src/environments/environment.ts`

## 🔧 Modifier l'URL de l'API

**Si ton backend n'est pas sur localhost:8080** :

1. Ouvre `src/environments/environment.ts`
2. Modifie :
```typescript
apiUrl: 'http://localhost:XXXX', // ← Ton port ici
```
3. Sauvegarde et recharge l'app

## 📞 Endpoints requis dans ton backend

```
✅ POST /auth/login       → Connexion
✅ POST /auth/refresh     → Refresh token (auto)
✅ GET  /users/me         → Infos utilisateur
```

## 🔍 Déboguer

Ouvre DevTools (F12) :
- **Console** : Voir les erreurs
- **Network** : Voir les requêtes HTTP
- **Application → Local Storage** : Voir le token après login

---

**Tout est configuré ✅** - Tu peux maintenant tester !

Voir **BACKEND_CONFIGURATION.md** pour le guide complet.

