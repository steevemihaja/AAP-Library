# LibraryManager - Frontend Angular

Migration complète du frontend de React vers Angular avec Tailwind CSS.

## 📋 Structure du projet

````
frontend/
├── src/
│   ├── app/
│   │   ├── components/        # Composants réutilisables
│   │   │   └── navbar/        # Barre de navigation
│   │   ├── pages/             # Pages principales
│   │   │   ├── auth/          # Pages d'authentification
│   │   │   ├── books/         # Pages livres
│   │   │   ├── user/          # Pages utilisateur
│   │   │   ├── home.component.ts
│   │   │   └── dashboard.component.ts
│   │   ├── services/          # Services
│   │   │   ├── auth.service.ts
│   │   │   └── book.service.ts
│   │   ├── interceptors/      # Intercepteurs HTTP
│   │   │   ├── auth.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   ├── guards/            # Guards de sécurité
│   │   │   └── auth.guards.ts
│   │   ├── models/            # Modèles TypeScript
│   │   ├── app.component.ts
│   │   ├── app.routes.ts      # Définition des routes
│   ├── styles/                # Fichiers de style Tailwind
│   ├── environments/          # Configuration d'environnement
│   ├── main.ts                # Point d'entrée
│   └── index.html
├── angular.json               # Configuration Angular CLI
├── tsconfig.json              # Configuration TypeScript
├── tailwind.config.js         # Configuration Tailwind CSS
├── postcss.config.js
└── package.json

## 🛠️ Installation

### Prérequis
- Node.js >= 18
- npm >= 9

### Étapes d'installation

1. **Installer les dépendances**
```bash
cd frontend
npm install
````

2. **Démarrer le serveur de développement**

```bash
npm start
```

L'application sera disponible à `http://localhost:4200`

3. **Construire pour la production**

```bash
npm run build:prod
```

## 📦 Dépendances principales

- **@angular/core**: Framework Angular
- **@angular/router**: Gestion des routes
- **@angular/forms**: Gestion des formulaires réactifs
- **@angular/common/http**: Client HTTP
- **tailwindcss**: Framework CSS
- **rxjs**: Programmation réactive
- **axios**: Client HTTP (optionnel)

## 🔐 Authentification

L'application utilise un service d'authentification qui:

- Stocke le token JWT dans localStorage
- Ajoute automatiquement le token aux requêtes

### Structure des pages d'authentification:

- `/login` - Page de connexion
- `/register` - Page d'inscription

## 📚 Gestion des livres

### Pages disponibles:

- `/` - Accueil
- `/books` - Liste des livres avec filtres
- `/books/:id` - Détails du livre
- `/books/add` - Ajouter un livre (admin/librarian)
- `/my-borrowings` - Mes emprunts (requiert authentification)
- `/dashboard` - Tableau de bord utilisateur (requiert authentification)

### Fonctionnalités:

- ✅ Recherche et filtrage des livres
- ✅ Détails du livre avec avis
- ✅ Emprunt de livres
- ✅ Gestion des emprunts
- ✅ Liste d'attente
- ✅ Système d'évaluation

## 🔒 Protection des routes

Les routes sont protégées par des guards Angular:

- `authGuardFn` - Vérifie si l'utilisateur est connecté
- `adminGuardFn` - Vérifie si l'utilisateur est admin/librarian

Exemple:

```typescript
{
  path: 'books/add',
  component: BookAddComponent,
  canActivate: [adminGuardFn]
}
```

## 🎨 Personnalisation Tailwind

Configuration Tailwind dans `tailwind.config.js`:

- Couleurs primaires personnalisées
- Utilitaires de boutons (btn-primary, btn-secondary, btn-danger)
- Utilitaires de formulaires (input-field)

## 🔄 Intercepteurs HTTP

### AuthInterceptor

- Ajoute le token JWT à chaque requête
- Exclut les requêtes de login/register

### ErrorInterceptor

- Gère les erreurs 401 (authentification expiée)
- Redirige automatiquement vers la page de login

## 📝 Configuration d'environnement

Fichiers d'environnement dans `src/environments/`:

- `environment.ts` - Configuration développement
- `environment.prod.ts` - Configuration production

## 🚀 Déploiement

### Construire l'application

```bash
npm run build:prod
```

### Servir les fichiers statiques

Les fichiers compilés sont dans `dist/library-frontend/`

### Avec Docker

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=build /app/dist/library-frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🐛 Dépannage

### Port déjà utilisé

```bash
ng serve --port 4300
```

### Problèmes de CORS

Vérifiez que le backend est configuré pour accepter les requêtes du frontend

### Cache TypeScript

```bash
rm -rf .angular/cache node_modules
npm install
```

## 📚 Ressources

- [Documentation Angular](https://angular.io/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [RxJS Documentation](https://rxjs.dev/)

## 📞 Support

Pour toute question ou problème, veuillez créer une issue sur le dépôt.
