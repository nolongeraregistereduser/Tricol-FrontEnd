Gestion des Approvisionnements et Stocks - TRICOL
1. Contexte du Projet
   L'entreprise TRICOL, spécialisée dans la conception et la fabrication de
   vêtements professionnels, poursuit la digitalisation de ses processus internes.
   Suite au développement réussi du backend Spring Boot gérant les
   approvisionnements, les stocks (méthode FIFO), et la sécurité (Spring Security
   avec JWT), il est désormais nécessaire de développer ses interfaces utilisateur.
   Cette application frontend doit permettre aux différents profils utilisateurs
   (Administrateur, Responsable Achats, Magasinier, Chef d'Atelier) d'interagir avec
   le système selon leurs permissions respectives, tout en garantissant une
   expérience utilisateur optimale.
2. Objectifs du Brief
1. Développer des interfaces utilisateur responsive avec Angular 20
2. Implémenter l'authentification JWT et la gestion des sessions
3. Gérer les autorisations dynamiques selon la matrice des permissions
4. Intégrer les fonctionnalités complètes de gestion (Fournisseurs, Produits,
   Commandes, Stock, Bons de Sortie)
5. Afficher les tableaux de bord et alertes en temps réel
6. Fournir une interface d'administration pour la gestion des utilisateurs et
   permissions
3. Stack Technique
   3.1 Technologies Principales
   • Framework : Angular 20
   • HTTP Client : Angular HttpClient avec Interceptors
   • Routing : Angular Router avec Guards
   • Forms : Reactive Forms
4. Architecture Applicative
   4.1 Structure des Modules
   L'application doit suivre une architecture modulaire (recommandée):
   • Core : Services(AuthService, HttpInterceptors, Guards)
   • Shared : Composants réutilisables, Pipes, Directives
   • Auth : Login, Register, Reset Password
   • Dashboard : Tableaux de bord par rôle
   • Fournisseurs : CRUD Fournisseurs
   • Produits : CRUD Produits, Alertes seuils
   • Commandes : Gestion des commandes fournisseurs
   • Stock : Consultation stock, Lots, Mouvements, Valorisation FIFO
   • BonsSortie : Gestion des bons de sortie atelier
   • Admin : Gestion utilisateurs, Rôles, Permissions, Logs d'audit
5. Fonctionnalités
   5.1 Module Authentification
   Pages à développer
   • Page Login : Formulaire email/mot de passe, Validation, Gestion des
   erreurs
   • Page Register : Inscription nouvel utilisateur (sans rôle par défaut)
   • Page Forgot Password : Réinitialisation mot de passe (optionnel)
   Services à implémenter
   • AuthService : login(), register(), logout(), refreshToken(), getCurrentUser()
   • TokenService : Stockage/récupération JWT (localStorage/session)
   • JwtInterceptor : Ajout automatique du token aux requêtes
   • AuthGuard : Protection des routes authentifiées
   5.2 Module Dashboard
   Dashboard adapté selon le rôle de l'utilisateur connecté :
   • Admin : Vue globale, statistiques système, accès logs d'audit
   • Responsable Achats : Commandes en cours, alertes stock, valorisation
   • Magasinier : Réceptions en attente, bons de sortie, stock critique
   • Chef d'Atelier : Bons de sortie, stock disponible
   5.3 Module Fournisseurs
   Fonctionnalités
   • Liste paginée avec recherche
   • Formulaire création/modification (Reactive Forms + validation)
   • Fiche détail fournisseur
   • Suppression avec confirmation (dialog)
   • Historique des commandes par fournisseur
   Champs du formulaire
   Raison sociale, Adresse complète, Ville, Personne de contact, Email, Téléphone,
   ICE
   5.4 Module Produits
   Fonctionnalités
   • Liste produits avec filtrage par catégorie, stock
   • Indicateur visuel stock critique (badge rouge)
   • CRUD complet
   • Configuration seuils d'alerte (point de commande)
   • Vue détail avec historique mouvements
   Champs du formulaire
   Référence, Nom, Description, Prix unitaire, Catégorie, Stock actuel (readonly),
   Point de commande, Unité de mesure
   5.5 Module Commandes Fournisseurs
   Fonctionnalités
   • Liste commandes avec filtrage (fournisseur, statut, période)
   • Création commande avec sélection fournisseur + multi-produits
   • Calcul automatique du montant total
   • statuts : EN_ATTENTE - VALIDÉE - LIVRÉE / ANNULÉE
   • Interface de réception de commande (création automatique des lots)
   • Boutons d'action conditionnels selon statut et permissions
   5.6 Module Stock & Lots
   Fonctionnalités
   • Vue globale du stock par produit
   • Détail des lots par produit (numéro lot, date entrée, quantité restante, prix)
   • Valorisation FIFO du stock
   • Historique des mouvements avec recherche avancée
   • Traçabilité lot - commande d'origine
   Recherche avancée mouvements
   Filtres à implémenter selon l'API backend :
   • Par période (date début / date fin)
   • Par produit (référence ou ID)
   • Par type de mouvement (ENTREE / SORTIE)
   • Par numéro de lot
   5.7 Module Bons de Sortie
   Fonctionnalités
   • Liste bons de sortie avec filtrage (statut, atelier, période)
   • Création bon de sortie (statut BROUILLON)
   • Ajout multi-produits avec vérification stock disponible
   • Validation du bon (déclenche sortie FIFO automatique)
   • Annulation possible si statut BROUILLON
   • Traçabilité : lien vers mouvements de stock générés
   Champs du formulaire
   Numéro unique, Date de sortie, Atelier destinataire, Liste produits + quantités,
   Motif (PRODUCTION / MAINTENANCE / AUTRE), Statut
   5.8 Module Administration
   Gestion des Utilisateurs
   • Liste utilisateurs avec statut (avec/sans rôle)
   • Attribution/modification de rôle
   • Interface de personnalisation des permissions par utilisateur
   • Visualisation des permissions effectives (rôle + personnalisations)
   Logs d'Audit (Optionnel)
   • Tableau des actions tracées (qui, quoi, quand)
   • Filtrage par utilisateur, type d'action, période
   • Historique des connexions/déconnexions
6. Matrice des Permissions (Frontend)
   L'interface doit respecter la matrice des permissions et adapter l'affichage selon
   le rôle de l'utilisateur connecté. Les actions non autorisées doivent être
   masquées ou désactivées.
   (Voir la Matrice des permissions)
   6.1 Gestion Dynamique des Permissions
   Le frontend doit gérer les cas où les permissions individuelles diffèrent du rôle de
   base.
7. Exigences Techniques
   7.1 Sécurité Frontend
1. Stockage sécurisé des tokens (httpOnly cookies recommandé ou
   localStorage)
2. Refresh token automatique avant expiration
3. Redirection vers login en cas de token invalide/expiré
4. Protection CSRF si utilisation de cookies
5. Sanitization des inputs utilisateur
   7.2 Gestion des Erreurs
   • Interceptor global pour capturer les erreurs HTTP
   • Messages d'erreur utilisateur-friendly (toast notifications)
   • Page 404 personnalisée
   • Page 403 (Accès refusé)
   • Page 500 (Erreur serveur)
   7.3 UX/UI Requirements
   • Design responsive (mobile-first)
   • Loading states (spinners)
   • Confirmation dialogs pour actions destructives
   • Notifications toast (succès, erreur, warning)
   • Pagination côté serveur pour les listes
8. Déploiement & CI/CD
   8.1 Dockerization
   • Dockerfile multi-stage (build + serve avec Nginx)
   • Configuration Nginx pour SPA routing
   • Variables d'environnement pour API URL
   8.2 GitHub Actions
   • Workflow : Build - Docker Build - Push Docker Hub
   • Secrets GitHub : DOCKER_USERNAME, DOCKER_PASSWORD
   • Déclenchement sur push branch main/develop
9. Notes Complémentaires
   • OAuth2 (optionnel) : L'authentification OAuth2 est optionnelle mais peut
   être ajoutée ultérieurement
   • API Backend : L'API REST Spring Boot est déjà développée et documentée
   • Environnements : Prévoir les fichiers environment pour dev, staging,
   production
