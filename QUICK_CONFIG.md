# 🎯 CONFIGURATION POUR TEST - RÉSUMÉ VISUEL

## ✅ APPLICATION PRÊTE

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   🟢 Angular App : http://localhost:4200              │
│                                                         │
│   ↓ communique avec ↓                                  │
│                                                         │
│   🟢 Spring Boot : http://localhost:8080              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 📝 SI TON BACKEND EST SUR UN AUTRE PORT

### Exemple : Backend sur port 9090

**Modifie** : `src/environments/environment.ts`

```typescript
// AVANT
apiUrl: 'http://localhost:8080',

// APRÈS
apiUrl: 'http://localhost:9090',
```

**Sauvegarde** → L'app se recharge automatiquement ✅

---

## 🔥 POUR TESTER MAINTENANT

### ✅ Checklist rapide

```bash
# 1. Backend Spring Boot démarré ?
curl http://localhost:8080
# ✅ Doit répondre (même erreur 404 OK)

# 2. CORS configuré ?
# ✅ Ajoute dans WebConfig.java :
#    .allowedOrigins("http://localhost:4200")

# 3. Angular tourne ?
# ✅ Déjà lancé sur http://localhost:4200

# 4. User de test prêt ?
# ✅ Tu as un user dans ta base de données
```

### 🎬 Action !

1. **Ouvre** : http://localhost:4200
2. **Entre** : ton email et mot de passe backend
3. **Clique** : "Se connecter"

### 🎉 Résultat attendu

```
✅ Redirection vers /dashboard
✅ Message : "Bienvenue, [ton nom] !"
✅ Affichage de tes infos utilisateur
✅ Bouton "Se déconnecter" visible
```

---

## 🚨 ERREURS POSSIBLES

### 1. Erreur CORS
```
❌ Access-Control-Allow-Origin blocked
```

**Solution** : Configure CORS dans ton backend

```java
// WebConfig.java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOrigins("http://localhost:4200")
            .allowedMethods("*")
            .allowedHeaders("*");
}
```

---

### 2. Connexion impossible
```
❌ Impossible de se connecter au serveur
```

**Causes possibles** :
- Backend pas démarré
- Mauvais port dans `environment.ts`
- Firewall qui bloque

**Solution** :
1. Vérifie que Spring Boot tourne : `curl http://localhost:8080`
2. Vérifie le port dans `src/environments/environment.ts`

---

### 3. Email/Password incorrect
```
❌ Email ou mot de passe incorrect
```

**Solution** : Vérifie que le user existe dans ta base de données

```sql
-- Vérifie dans ta base
SELECT * FROM users WHERE email = 'ton_email@tricol.com';
```

---

### 4. Endpoint 404
```
❌ 404 Not Found : /auth/login
```

**Solution** : L'endpoint est différent dans ton backend

**Vérifie** le chemin exact dans ton Spring Boot, par exemple :
- `/api/auth/login` ?
- `/authenticate` ?

**Modifie** : `src/environments/environment.ts`

```typescript
apiEndpoints: {
  auth: '/api/auth',  // ← Change ici
  // ...
}
```

---

## 📊 FLUX COMPLET ATTENDU

```
┌──────────────────────────────────────────────────────┐
│ 1. User entre email + password                      │
└───────────────────────┬──────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│ 2. Angular → POST /auth/login                       │
│    Body: { email, password }                        │
└───────────────────────┬──────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│ 3. Spring Boot vérifie credentials                  │
└───────────────────────┬──────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│ 4. Spring Boot répond :                             │
│    { accessToken: "jwt...", refreshToken: "..." }   │
└───────────────────────┬──────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│ 5. Angular stocke tokens dans localStorage          │
└───────────────────────┬──────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│ 6. Angular → GET /users/me                          │
│    Headers: Authorization: Bearer <token>           │
└───────────────────────┬──────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│ 7. Spring Boot répond :                             │
│    { id, username, email, roles, permissions }      │
└───────────────────────┬──────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│ 8. Angular affiche Dashboard avec infos user        │
└──────────────────────────────────────────────────────┘
```

---

## 🔍 DÉBOGUER

### Ouvre DevTools (F12)

#### Onglet Console
```
→ Voir les erreurs JavaScript
→ Messages de l'AuthService
```

#### Onglet Network
```
→ Filtre : XHR
→ Cherche : "login"
→ Vérifie :
  - Status Code (200 = OK)
  - Request URL
  - Response Body
```

#### Onglet Application → Local Storage
```
→ Après connexion, vérifie :
  - tricol_access_token : doit être présent
  - tricol_refresh_token : doit être présent
→ Copie le token et décode sur https://jwt.io
```

---

## 📚 DOCUMENTATION

| Besoin | Fichier |
|--------|---------|
| 🚀 **Démarrer vite** | `START_HERE.md` |
| 🧪 **Tester auth** | `TEST_AUTH.md` |
| 🔧 **Config backend** | `BACKEND_CONFIGURATION.md` |
| 📖 **Recap complet** | `RECAP_FINAL.md` |
| 📋 **Roadmap projet** | `IMPLEMENTATION_PLAN.md` |

---

## ✅ TU ES PRÊT !

```
┌────────────────────────────────────────┐
│                                        │
│  🎯 Ouvre : http://localhost:4200     │
│                                        │
│  📧 Entre : ton email backend         │
│                                        │
│  🔑 Entre : ton password backend      │
│                                        │
│  🚀 Clique : "Se connecter"           │
│                                        │
│  ✅ Dashboard affiché !               │
│                                        │
└────────────────────────────────────────┘
```

**L'application Angular tourne déjà !**

Tout est configuré. Il ne reste plus qu'à tester avec ton backend. 🎉

