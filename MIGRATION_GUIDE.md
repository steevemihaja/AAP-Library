# Configuration de démarrage rapide pour le frontend Angular

## Installation

```bash
cd frontend
npm install
```

## Démarrage

```bash
npm start
```

Ou utilisez le script helper:

```bash
chmod +x start.sh
./start.sh
```

## Structure complète de l'application

### Services Angular (frontend/src/app/services/)

- **auth.service.ts** - Gestion authentification, JWT, utilisateur
- **book.service.ts** - Opérations CRUD et filtrage des livres

### Pages composants

- **auth/login.component.ts** - Formulaire de connexion
- **auth/register.component.ts** - Formulaire d'inscription
- **books/book-list.component.ts** - Liste & recherche livres
- **books/book-detail.component.ts** - Détails livre + avis
- **books/book-add.component.ts** - Ajouter un livre (admin)
- **user/my-borrowings.component.ts** - Gestion emprunts
- **dashboard.component.ts** - Tableau de bord utilisateur
- **home.component.ts** - Page d'accueil

### Composants réutilisables

- **components/navbar/navbar.component.ts** - Barre de navigation

## Routes disponibles

| Route            | Description      | Protégée |
| ---------------- | ---------------- | -------- |
| `/`              | Accueil          | Non      |
| `/login`         | Connexion        | Non      |
| `/register`      | Inscription      | Non      |
| `/books`         | Liste des livres | Non      |
| `/books/add`     | Ajouter un livre | Admin    |
| `/books/:id`     | Détails du livre | Non      |
| `/my-borrowings` | Mes emprunts     | Auth     |
| `/dashboard`     | Tableau de bord  | Auth     |

## Variables d'environnement

Créez un fichier `.env` à la racine du projet:

```
ANGULAR_API_URL=http://localhost:5000/api
```

## Commandes disponibles

- `npm start` - Démarrage dev
- `npm run build` - Build dev
- `npm run build:prod` - Build production
- `npm test` - Tests
- `npm run lint` - Linter

## Améliorations apportées par rapport à React

✅ Type-safety complète avec TypeScript
✅ Gestion d'état avec RxJS/Observable
✅ Intercepteurs HTTP intégrés
✅ Guards de route pour sécurité
✅ Standalone components (Angular 15+)
✅ Lazy loading possible
✅ Meilleure performance build

## Prochaines étapes (optionnel)

- Ajouter state management (NgRx)
- Implémenter la pagination
- Ajouter des animations
- Améliorer responsive design
- Ajouter tests unitaires
