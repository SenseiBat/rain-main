# 📊 RAIN - Site Documentaire VTOM

> **Site de documentation et d'orchestration du plan VTOM**  
> Une application web moderne pour visualiser, explorer et gérer les environnements, applications et traitements VTOM.

---

## 📑 Table des matières

1. [Vue d'ensemble](#-vue-densemble)
2. [Fonctionnalités principales](#-fonctionnalités-principales)
3. [Architecture technique](#-architecture-technique)
4. [Installation et démarrage](#-installation-et-démarrage)
5. [Structure du projet](#-structure-du-projet)
6. [Guide d'utilisation](#-guide-dutilisation)
7. [Guide développeur](#-guide-développeur)
8. [API et intégrations](#-api-et-intégrations)
9. [Déploiement](#-déploiement)
10. [Maintenance et contribution](#-maintenance-et-contribution)

---

## 🎯 Vue d'ensemble

**RAIN** est une plateforme web de documentation interactive pour le système d'orchestration VTOM. Elle permet aux utilisateurs de :

- 🗺️ **Visualiser** le plan complet VTOM avec ses applications et traitements
- 🔍 **Rechercher** rapidement des applications et traitements spécifiques
- 📚 **Consulter** la documentation utilisateur et développeur
- 🌐 **Explorer** les environnements VTOM et leurs applications en temps réel
- 🎨 **Personnaliser** l'expérience avec un thème clair/sombre

### Technologies utilisées

**Frontend:**
- ⚛️ React 19.2 avec TypeScript 5.7
- 🚀 Vite 7.2 (build ultra-rapide)
- 🎨 CSS natif (pas de framework CSS externe)
- 🧭 React Router 7 (navigation SPA)

**Backend:**
- 🐘 PHP 8.2 avec Laravel 12
- 🐘 PostgreSQL 16
- 🐳 Docker & Docker Compose

---

## ✨ Fonctionnalités principales

### 1. 🏠 Page d'accueil

La page d'accueil offre un point d'entrée centralisé avec :

- **Bandeau de navigation (Hero)** : Logo VTOM, titre, sous-titre et boutons de navigation
- **Indicateurs de connexion** : Statut du backend Laravel et des environnements VTOM
- **Section teaser** : Présentation du plan VTOM avec CTA vers la page Plan
- **Card documentation** : Accès rapide à la documentation
- **Accès rapide (Quick Access)** : Grille de cartes cliquables vers les fonctionnalités principales
  - Plan VTOM complet
  - Recherche avancée
  - Documentation technique

### 2. 🗺️ Plan VTOM

Visualisation complète du plan applicatif avec deux vues :

#### Vue verticale (PlanBoard)
- **Colonnes fonctionnelles** : Phases, MDE, PAY/Interfaces
- **Applications organisées** par domaine fonctionnel
- **Pilules colorées** cliquables pour chaque application

#### Vue horizontale (Landscape)
- **Paysage applicatif** avec structure hiérarchique
- **Sections thématiques** : Traitements techniques, ponctuels, etc.
- **Types de représentation** :
  - `stack` : Applications empilées
  - `grid` : Grille d'applications
  - `connection` : Connexion entre deux applications
  - `single` : Application unique

#### Interactions
- **Clic sur une application** → Ouvre une modale avec la liste des traitements
- **Clic sur un traitement** → Ouvre une modale détaillée avec les jobs et scripts
- **Support clavier** : Touche Échap pour fermer les modales
- **Animations fluides** : Transitions de 220ms pour l'ouverture/fermeture

### 3. 🔍 Recherche avancée

Modale plein écran de recherche avec :

- **Recherche en temps réel** : Filtrage instantané pendant la saisie
- **Insensible à la casse** et aux accents
- **Navigation clavier** :
  - `Échap` : Fermer la modale
  - `Entrée` : Sélectionner le premier résultat
- **Affichage des résultats** avec nom et colonne d'appartenance
- **Compteur de résultats** trouvés
- **Redirection automatique** : Sélection → ouverture du Plan avec l'application pré-sélectionnée

### 4. 📚 Documentation

Deux types de documentation accessibles :

#### Documentation utilisateur
- Introduction au site
- Navigation et utilisation
- Recherche d'applications
- Consultation du plan
- Personnalisation du thème

#### Documentation développeur
- Architecture technique
- Structure des données
- Conventions de code
- Bonnes pratiques
- Guide de contribution

**Fonctionnalités :**
- Modale plein écran avec contenu structuré
- Parsing automatique des sections numérotées
- Support des listes à puces
- Navigation fluide avec fermeture par Échap ou clic backdrop

### 5. 🌐 Vtom JSON

Page dédiée à l'exploration des données VTOM en temps réel :

#### Environnements VTOM
- **Liste des environnements** disponibles
- **Affichage en grille** de cartes
- **Compteur** du nombre d'environnements

#### Applications PAY_TOURS
- **Accordion interactif** pour explorer les détails
- **Affichage complet** de toutes les propriétés JSON
- **Gestion des états** : loading, erreur, données
- **Formatage automatique** des objets JSON

### 6. 🎨 Personnalisation du thème

Basculez entre mode clair et sombre :

- **Bouton de bascule** dans le bandeau de navigation
- **Persistance** : Sauvegarde dans cookie + localStorage
- **Transition fluide** de 800ms
- **Icônes adaptatives** : 🌙 (mode sombre) / ☀️ (mode clair)
- **Mode clair** inspiré de la charte de l'État français

### 7. 🍪 Gestion des cookies (RGPD)

Bannière de consentement conforme RGPD :

- **Affichage automatique** au premier chargement
- **Choix utilisateur** : Accepter ou Refuser
- **Persistance** de la préférence (365 jours)
- **Utilisation minimale** : Uniquement pour les préférences de thème

---

## 🏗️ Architecture technique

### Architecture globale

```
┌─────────────────────────────────────────────────────────────┐
│                       RAIN Application                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐      ┌──────────────┐                  │
│  │   Frontend     │      │   Backend    │                  │
│  │   React + TS   │◄────►│   Laravel    │                  │
│  │   (Port 5179)  │ HTTP │  (Port 8009) │                  │
│  └────────────────┘      └──────────────┘                  │
│          │                       │                          │
│          │                       ▼                          │
│          │              ┌──────────────┐                    │
│          │              │  PostgreSQL  │                    │
│          │              │  (Port 5439) │                    │
│          │              └──────────────┘                    │
│          │                                                  │
│          ▼                                                  │
│  ┌────────────────┐                                        │
│  │   API VTOM     │                                        │
│  │  (External)    │                                        │
│  └────────────────┘                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Frontend - Architecture React

```typescript
App (BrowserRouter)
  └─ PlanDataProvider (données du plan)
      └─ ThemeProvider (thème clair/sombre)
          └─ AppLayout (routes + layout)
              ├─ Hero (navigation)
              ├─ Routes
              │   ├─ Home (/)
              │   ├─ Documentation (/documentation)
              │   ├─ VtomJson (/vtom-json)
              │   └─ PlanPage (/plan)
              ├─ AdvancedSearchModal
              ├─ CookieConsent
              └─ Footer
```

### Flux de données

#### 1. Données statiques (plan-data.json)
```
plan-data.json
    ↓
PlanDataProvider (parsing)
    ↓
usePlanData() hook
    ↓
Composants (Hero, Home, PlanPage, etc.)
```

#### 2. Données dynamiques (API VTOM)
```
API VTOM
    ↓
useVtomEnvironments() / useVtomApplications()
    ↓
Composants (Home, VtomJson)
```

#### 3. Gestion du thème
```
Cookie/localStorage
    ↓
ThemeProvider
    ↓
useTheme() hook
    ↓
document.documentElement.dataset.theme
    ↓
CSS (variables personnalisées)
```

### Backend - Architecture Laravel

```
Routes (web.php)
    ├─ /api/health (health check)
    ├─ /api/message (test backend)
    └─ /api/vtom/environments (proxy VTOM)

Controllers
    └─ ApiController
        ├─ message() : JsonResponse
        └─ vtomEnvironments() : JsonResponse
```

---

## 🚀 Installation et démarrage

### Prérequis

- 🐳 Docker & Docker Compose
- 📦 Node.js 18+ (pour développement local sans Docker)
- 🐘 PHP 8.2+ (pour développement local sans Docker)

### Installation avec Docker (Recommandé)

1. **Cloner le dépôt**
```bash
git clone <repository-url>
cd rain-main
```

2. **Configurer l'environnement backend**
```bash
cd back
cp .env.example .env
# Éditer .env si nécessaire
```

3. **Lancer l'application**
```bash
cd ..
docker-compose up -d
```

4. **Initialiser la base de données** (premier lancement uniquement)
```bash
docker exec -it back_vitrine php artisan migrate
```

5. **Accéder à l'application**
- Frontend : http://localhost:5179
- Backend API : http://localhost:8009
- PostgreSQL : localhost:5439

### Installation locale (sans Docker)

#### Backend (Laravel)

```bash
cd back

# Installation des dépendances
composer install

# Configuration
cp .env.example .env
php artisan key:generate

# Base de données
php artisan migrate

# Lancer le serveur
php artisan serve --port=8009
```

#### Frontend (React)

```bash
cd front

# Installation des dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur http://localhost:5173

### Arrêt de l'application

```bash
docker-compose down

# Pour supprimer également les volumes
docker-compose down -v
```

---

## 📂 Structure du projet

```
rain-main/
├── docker-compose.yml          # Orchestration des services
├── README.md                   # Cette documentation
├── tours.xml                   # Configuration VTOM
│
├── back/                       # Backend Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── ApiController.php
│   │   │   └── Middleware/
│   │   ├── Models/
│   │   │   └── User.php
│   │   └── Providers/
│   ├── config/                 # Configuration Laravel
│   ├── database/
│   │   ├── migrations/         # Migrations de base de données
│   │   └── seeders/
│   ├── routes/
│   │   └── web.php             # Définition des routes API
│   ├── composer.json           # Dépendances PHP
│   ├── Dockerfile
│   └── .env                    # Variables d'environnement
│
└── front/                      # Frontend React + TypeScript
    ├── src/
    │   ├── components/         # Composants React
    │   │   ├── AppLayout.tsx       # Layout principal + routing
    │   │   ├── Hero.tsx            # Bandeau de navigation
    │   │   ├── Home.tsx            # Page d'accueil
    │   │   ├── Documentation.tsx   # Page documentation
    │   │   ├── VtomJson.tsx        # Page VTOM JSON
    │   │   ├── PlanPage.tsx        # Page du plan VTOM
    │   │   ├── PlanBoard.tsx       # Tableau du plan
    │   │   ├── PlanModal.tsx       # Modale application
    │   │   ├── TreatmentModal.tsx  # Modale traitement
    │   │   ├── AdvancedSearchModal.tsx  # Modale recherche
    │   │   ├── QuickAccess.tsx     # Section accès rapide
    │   │   ├── LandscapeRow.tsx    # Ligne du paysage
    │   │   ├── PlanPill.tsx        # Pilule d'application
    │   │   ├── GhostButton.tsx     # Bouton réutilisable
    │   │   ├── ThemeToggleButton.tsx    # Toggle thème
    │   │   ├── CookieConsent.tsx   # Bannière cookies
    │   │   └── Footer.tsx          # Pied de page
    │   ├── contexts/           # Providers React Context
    │   │   ├── PlanDataProvider.tsx    # Provider données plan
    │   │   └── ThemeProvider.tsx       # Provider thème
    │   ├── hooks/              # Hooks personnalisés
    │   │   ├── usePlanData.ts          # Hook données plan
    │   │   ├── useBackendMessage.tsx   # Hook test backend
    │   │   ├── useVtomEnvironments.tsx # Hook environnements VTOM
    │   │   └── useVtomApplications.tsx # Hook applications VTOM
    │   ├── data/               # Données statiques
    │   │   ├── plan-data.json              # Données du plan VTOM
    │   │   ├── documentation_utilisateur.json
    │   │   ├── documentation_developpeur.json
    │   │   ├── code-documentation.ts
    │   │   └── logo-vtom.png
    │   ├── constants/          # Constantes de l'application
    │   │   └── index.ts            # Configuration API, URLs
    │   ├── types/              # Types TypeScript
    │   ├── utils/              # Utilitaires
    │   │   └── cookies.ts          # Gestion des cookies
    │   ├── App.tsx             # Composant racine
    │   ├── App.css             # Styles principaux
    │   ├── index.css           # Reset CSS + variables
    │   └── main.tsx            # Point d'entrée
    ├── public/
    ├── package.json            # Dépendances npm
    ├── vite.config.js          # Configuration Vite
    ├── tsconfig.json           # Configuration TypeScript
    └── Dockerfile
```

---

## 📖 Guide d'utilisation

### Navigation

#### 1. Accueil

En arrivant sur la page d'accueil :

1. **Bandeau Hero** : Utilisez les boutons pour naviguer
   - 🏠 Accueil
   - 📚 Documentation
   - 🗺️ Plan VTOM
   - 🌐 Vtom JSON

2. **Vérification de connexion** : 
   - ✅ Backend connecté : Message de succès
   - 🌐 Environnements VTOM : Liste des environnements disponibles

3. **Section teaser** : Aperçu du plan avec bouton "Voir le plan"

4. **Card documentation** : Accès direct avec bouton "Explorer la documentation"

5. **Accès rapide** : Cliquez sur une carte pour :
   - Consulter le plan complet
   - Lancer la recherche avancée
   - Lire la documentation

#### 2. Plan VTOM

**Accéder au plan :**
- Depuis l'accueil : bouton "Voir le plan" ou carte "Plan VTOM complet"
- Depuis le bandeau : bouton "🗺️ Plan VTOM"

**Navigation dans le plan :**

1. **Vue colonnes** :
   - Consultez les différentes colonnes (Phases, MDE, PAY/Interfaces)
   - Cliquez sur une pilule colorée pour ouvrir les détails

2. **Vue paysage** :
   - Explorez les sections (Traitements techniques, ponctuels, etc.)
   - Cliquez sur une application pour voir ses traitements

3. **Modale application** :
   - Liste des traitements de l'application sélectionnée
   - Description (summary) si disponible
   - Cliquez sur un traitement pour voir les détails

4. **Modale traitement** :
   - Nom du script exécuté
   - Liste des jobs associés
   - Bouton "Retour" pour revenir à la modale application

**Actions disponibles :**
- 🔎 Recherche avancée : Ouvrir la modale de recherche
- ↩️ Retour à l'accueil : Revenir à la page d'accueil

#### 3. Recherche avancée

**Lancer la recherche :**
- Depuis l'accueil : carte "Recherche avancée"
- Depuis le plan : bouton "🔎 Recherche avancée"

**Utiliser la recherche :**

1. **Saisir un mot-clé** dans le champ de recherche
2. **Résultats en temps réel** : Filtrage automatique
3. **Sélection** :
   - Clic sur un résultat
   - Ou `Entrée` pour le premier résultat
4. **Redirection automatique** vers le plan avec l'application sélectionnée

**Navigation clavier :**
- `Échap` : Fermer la modale
- `Entrée` : Sélectionner le premier résultat

#### 4. Documentation

**Accéder à la documentation :**
- Depuis l'accueil : bouton "Explorer la documentation"
- Depuis le bandeau : bouton "📚 Documentation"

**Consulter la documentation :**

1. **Choisir le type** :
   - 🧭 Documentation utilisateur : Guide d'utilisation du site
   - 💻 Documentation développeur : Guide technique

2. **Lire le contenu** :
   - Sections numérotées automatiquement
   - Listes à puces pour les détails
   - Sous-sections pour l'organisation

3. **Fermer la modale** :
   - Clic sur la croix (×)
   - Clic en dehors de la modale
   - Touche `Échap`

#### 5. Vtom JSON

**Accéder à la page :**
- Depuis le bandeau : bouton "🌐 Vtom JSON"

**Explorer les données :**

1. **Environnements VTOM** :
   - Grille de cartes avec nom et ID
   - Compteur du nombre d'environnements

2. **Applications PAY_TOURS** :
   - Cliquez sur une application pour déplier ses détails
   - Toutes les propriétés JSON affichées
   - Formatage automatique des objets

### Personnalisation

#### Changer le thème

1. **Localiser le bouton** dans le bandeau de navigation
   - 🌙 Mode sombre (par défaut)
   - ☀️ Mode clair

2. **Cliquer sur le bouton** pour basculer

3. **Transition fluide** de 800ms

4. **Persistance automatique** : Votre choix est sauvegardé

#### Gérer les cookies

**Au premier chargement :**
- Bannière de consentement en bas de page
- Choix : Accepter ou Refuser

**Utilisation des cookies :**
- Sauvegarde des préférences de thème uniquement
- Aucune donnée personnelle collectée
- Persistance de 365 jours

---

## 👨‍💻 Guide développeur

### Technologies et outils

#### Frontend
- **React 19.2** : Bibliothèque UI avec hooks
- **TypeScript 5.7** : Typage statique strict
- **Vite 7.2** : Build tool ultra-rapide
- **React Router 7** : Routing SPA
- **CSS natif** : Pas de framework (Tailwind, Bootstrap, etc.)

#### Backend
- **PHP 8.2** : Langage serveur
- **Laravel 12** : Framework PHP moderne
- **PostgreSQL 16** : Base de données relationnelle

#### DevOps
- **Docker & Docker Compose** : Conteneurisation
- **ESLint** : Linter JavaScript/TypeScript
- **Prettier** : Formatage de code (optionnel)

### Structure des composants

#### Composants principaux

**App.tsx**
- Point d'entrée de l'application
- Encapsule dans les providers (Router, PlanData, Theme)
- Initialise AppLayout

**AppLayout.tsx**
- Layout principal avec routing
- Gère les routes : /, /plan, /documentation, /vtom-json
- Coordination de la modale de recherche
- Distribution des données du plan

**Hero.tsx**
- Bandeau de navigation permanent
- Logo, titre, boutons de navigation
- Toggle du thème

#### Composants de pages

**Home.tsx**
- Page d'accueil
- Affichage du statut backend/VTOM
- Quick Access
- Teasers vers Plan et Documentation

**PlanPage.tsx**
- Page du plan VTOM
- Affichage PlanBoard + Landscape
- Gestion des modales application/traitement
- Support de la sélection depuis recherche

**Documentation.tsx**
- Page de documentation
- Toggle utilisateur/développeur
- Parsing automatique du contenu JSON

**VtomJson.tsx**
- Page VTOM JSON
- Liste des environnements
- Accordion des applications PAY_TOURS

#### Composants de plan

**PlanBoard.tsx**
- Tableau principal du plan
- Colonnes fonctionnelles + paysage
- Actions : recherche, retour

**PlanModal.tsx**
- Modale d'affichage d'une application
- Liste des traitements
- Animation d'ouverture/fermeture (220ms)

**TreatmentModal.tsx**
- Modale de détail d'un traitement
- Liste des jobs et scripts
- Boutons retour (plan ou application)

**LandscapeRow.tsx**
- Ligne du paysage applicatif
- Types : stack, grid, connection, single

**PlanPill.tsx**
- Pilule d'application cliquable
- Couleur personnalisée par CSS var

#### Composants utilitaires

**AdvancedSearchModal.tsx**
- Modale de recherche plein écran
- Filtrage en temps réel
- Navigation clavier

**QuickAccess.tsx**
- Grille de cartes d'accès rapide
- Liens vers fonctionnalités principales

**GhostButton.tsx**
- Bouton réutilisable avec variantes
- Icône + label
- États : default, outline, primary

**ThemeToggleButton.tsx**
- Bouton de bascule du thème
- Icône adaptative (🌙/☀️)

**CookieConsent.tsx**
- Bannière RGPD
- Gestion du consentement cookies

**Footer.tsx**
- Pied de page

### Hooks personnalisés

**usePlanData**
```typescript
// Accès aux données du plan VTOM
const { 
  planData,           // Données complètes du plan
  planApplications,   // Liste aplatie des applications
  getAppDetail        // Fonction pour récupérer les détails d'une app
} = usePlanData()
```

**useTheme**
```typescript
// Gestion du thème
const { 
  theme,        // 'dark' | 'light'
  toggleTheme   // Fonction de bascule
} = useTheme()
```

**useBackendMessage**
```typescript
// Test de connexion backend
const { 
  message,    // Message du backend
  isLoading,  // État de chargement
  error       // Erreur éventuelle
} = useBackendMessage()
```

**useVtomEnvironments**
```typescript
// Récupération des environnements VTOM
const { 
  data,       // { environments, count }
  isLoading,  // État de chargement
  error       // Erreur éventuelle
} = useVtomEnvironments()
```

**useVtomApplications**
```typescript
// Récupération des applications d'un environnement
const { 
  data,       // { applications, count, environment }
  isLoading,  // État de chargement
  error       // Erreur éventuelle
} = useVtomApplications('PAY_TOURS')
```

### Conventions de code

#### TypeScript
- Mode strict activé
- Typage explicite de toutes les props
- Interfaces pour les structures complexes
- Types pour les unions et énumérations

#### React
- Composants fonctionnels uniquement
- Hooks pour la gestion d'état
- Props destructurées
- Mémoïsation avec useMemo/useCallback quand nécessaire

#### Naming
- Composants : PascalCase (ex: `PlanBoard.tsx`)
- Hooks : camelCase avec préfixe `use` (ex: `usePlanData`)
- Fichiers : même nom que le composant/hook
- CSS classes : kebab-case BEM (ex: `plan-board__header`)

#### Organisation des imports
```typescript
// 1. Imports React
import { useCallback, useMemo } from 'react'
// 2. Imports externes
import { useNavigate } from 'react-router-dom'
// 3. Imports de composants
import GhostButton from './GhostButton'
// 4. Imports de hooks
import { usePlanData } from '../hooks/usePlanData'
// 5. Imports de types
import { PlanColumn } from '../types'
// 6. Imports de constantes/utils
import { API_BASE_URL } from '../constants'
// 7. Imports d'assets
import logo from '../data/logo-vtom.png'
```

### Ajouter une nouvelle fonctionnalité

#### 1. Créer un composant

```bash
cd front/src/components
touch MonComposant.tsx
```

```typescript
/**
 * MonComposant - Description du composant
 * 
 * Fonctionnalités :
 * - Fonctionnalité 1
 * - Fonctionnalité 2
 */
import { useState } from 'react'

interface MonComposantProps {
  /** Description de la prop */
  title: string
  /** Callback optionnel */
  onAction?: () => void
}

function MonComposant({ title, onAction }: MonComposantProps) {
  const [state, setState] = useState<string>('')
  
  return (
    <div className="mon-composant">
      <h2>{title}</h2>
      {/* Contenu */}
    </div>
  )
}

export default MonComposant
```

#### 2. Ajouter les types

```typescript
// front/src/types/index.ts
export interface MaNouvelleDonnee {
  id: string
  name: string
  value: number
}
```

#### 3. Ajouter les styles

```css
/* front/src/App.css */
.mon-composant {
  padding: var(--space-4);
  background: var(--surface-2);
}

.mon-composant h2 {
  color: var(--text-1);
  margin-bottom: var(--space-3);
}
```

#### 4. Intégrer dans l'application

```typescript
// front/src/components/AppLayout.tsx
import MonComposant from './MonComposant'

// Dans la section Routes :
<Route path="/mon-chemin" element={<MonComposant title="..." />} />
```

### Modifier les données du plan

**Fichier : `front/src/data/plan-data.json`**

#### Structure générale
```json
{
  "hero": { /* Navigation */ },
  "homeSections": [ /* Sections accueil */ ],
  "documentationSections": [ /* Sections doc */ ],
  "quickAccess": { /* Accès rapide */ },
  "planColumns": [ /* Colonnes du plan */ ],
  "planDetails": { /* Détails applications */ },
  "landscape": { /* Paysage applicatif */ }
}
```

#### Ajouter une application

**1. Dans une colonne :**
```json
{
  "planColumns": [
    {
      "id": "pay",
      "title": "PAY / Interfaces",
      "items": [
        {
          "label": "NOUVELLE-APP",
          "color": "#ff6b6b"
        }
      ]
    }
  ]
}
```

**2. Ajouter les détails :**
```json
{
  "planDetails": {
    "NOUVELLE-APP": {
      "name": "NOUVELLE-APP",
      "summary": "Description de l'application",
      "treatments": [
        {
          "name": "TRAITEMENT-1",
          "script": "script.sh",
          "jobs": [
            { "label": "Job 1" },
            { "label": "Job 2" }
          ]
        }
      ]
    }
  }
}
```

**3. Dans le paysage (optionnel) :**
```json
{
  "landscape": {
    "sections": [
      {
        "title": "Ma section",
        "rows": [
          {
            "type": "single",
            "label": "NOUVELLE-APP",
            "color": "#ff6b6b"
          }
        ]
      }
    ]
  }
}
```

### Déboguer l'application

#### Activer les logs

**Frontend :**
```typescript
// Dans les hooks useVtomEnvironments/useVtomApplications
console.log('VTOM Data:', jsonData)
```

**Backend :**
```php
// Dans ApiController.php
\Log::info('API Call', ['data' => $data]);
```

#### Outils de développement

**React DevTools :**
- Inspecter les composants
- Voir les props et state
- Tracer les re-renders

**Network Tab :**
- Vérifier les appels API
- Inspecter les réponses
- Déboguer les erreurs CORS

#### Erreurs courantes

**1. Hook appelé hors du provider**
```
Error: usePlanData must be used within PlanDataProvider
```
→ S'assurer que le composant est enfant de PlanDataProvider

**2. API VTOM inaccessible**
```
❌ Erreur VTOM: HTTP 0: Failed to fetch
```
→ Vérifier la configuration réseau et les certificats SSL

**3. Routes ne fonctionnent pas**
```
Cannot GET /plan
```
→ Vérifier que BrowserRouter est bien configuré
→ En production, configurer le serveur pour servir index.html

---

## 🔌 API et intégrations

### API Backend Laravel

**Base URL :** `http://localhost:8009/api`

#### Endpoints disponibles

##### 1. Health Check
```http
GET /health
```

**Réponse :**
```json
{
  "status": "ok",
  "timestamp": "2026-01-19T10:30:00.000000Z"
}
```

##### 2. Message de test
```http
GET /message
```

**Réponse :**
```json
{
  "message": "Hello depuis Laravel !",
  "timestamp": "2026-01-19T10:30:00.000000Z",
  "status": "ok"
}
```

##### 3. Environnements VTOM
```http
GET /vtom/environments
```

**Réponse :**
```json
[
  {
    "id": "PAY_TOURS",
    "name": "PAY Tours"
  }
]
```

### API VTOM

**Base URL :** `https://10.37.44.206:40010/vtom/public/domain/5.0`

**Authentification :** Header `X-API-KEY`

#### Endpoints utilisés

##### 1. Liste des environnements
```http
GET /environments
Headers:
  X-API-KEY: Esp4Qo4tMy8rVe3q
```

**Réponse :**
```json
[
  {
    "id": "PAY_TOURS",
    "name": "PAY Tours"
  }
]
```

##### 2. Applications d'un environnement
```http
GET /environments/{environmentId}/applications
Headers:
  X-API-KEY: Esp4Qo4tMy8rVe3q
```

**Réponse :**
```json
[
  {
    "environment": "PAY_TOURS",
    "name": "INIT-JANVIER",
    "comment": "Préparation annuelle",
    "family": "string",
    "frequency": "Daily",
    "priority": {
      "enable": true,
      "value": 0
    },
    "execMode": "Job",
    "planning": { /* ... */ }
  }
]
```

### Configuration des API

**Fichier : `front/src/constants/index.ts`**

```typescript
// Backend Laravel
export const API_BASE_URL = 'http://10.37.44.204:8009'

// API VTOM
export const VTOM_API_URL = 'https://10.37.44.206:40010/vtom/public/domain/5.0'
export const VTOM_API_KEY = 'Esp4Qo4tMy8rVe3q'
```

### Gestion des erreurs API

#### Frontend - Hook pattern
```typescript
const [data, setData] = useState<T | null>(null)
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

try {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  setData(await response.json())
  setError(null)
} catch (err) {
  setError(err instanceof Error ? err.message : 'Erreur inconnue')
} finally {
  setIsLoading(false)
}
```

#### Backend - Laravel
```php
try {
    return response()->json(['data' => $data]);
} catch (\Exception $e) {
    return response()->json([
        'error' => $e->getMessage()
    ], 500);
}
```

---

## 🚀 Déploiement

### Déploiement avec Docker

#### Production

**1. Construire les images**
```bash
docker-compose build
```

**2. Lancer les services**
```bash
docker-compose up -d
```

**3. Vérifier les services**
```bash
docker-compose ps
```

#### Variables d'environnement

**Backend (.env)**
```env
APP_NAME=Rain
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=http://localhost:8009

DB_CONNECTION=pgsql
DB_HOST=db_vitrine
DB_PORT=5432
DB_DATABASE=app_db
DB_USERNAME=app_user
DB_PASSWORD=app_password
```

**Frontend (variables Vite)**
```env
VITE_API_URL=http://localhost:8009
```

### Déploiement sans Docker

#### Backend (Laravel)

**1. Configurer l'environnement**
```bash
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**2. Migrer la base de données**
```bash
php artisan migrate --force
```

**3. Configurer le serveur web**

**Nginx :**
```nginx
server {
    listen 80;
    server_name rain.example.com;
    root /var/www/rain/back/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

#### Frontend (React)

**1. Build de production**
```bash
cd front
npm run build
```

**2. Servir les fichiers statiques**

**Nginx :**
```nginx
server {
    listen 80;
    server_name rain-front.example.com;
    root /var/www/rain/front/dist;

    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Optimisations de production

#### Frontend
- ✅ Build minifié avec Vite
- ✅ Tree-shaking automatique
- ✅ Code splitting par route
- ✅ Compression gzip/brotli (serveur)
- ✅ Cache des assets statiques

#### Backend
- ✅ OPcache PHP activé
- ✅ Config/routes/views cachées
- ✅ Autoloader optimisé
- ✅ Queue workers pour jobs asynchrones

### Monitoring

#### Healthchecks

**Backend :**
```bash
curl http://localhost:8009/api/health
```

**Frontend :**
```bash
curl http://localhost:5179
```

**Base de données :**
```bash
docker exec db_vitrine pg_isready -U app_user -d app_db
```

#### Logs

**Backend Laravel :**
```bash
docker exec back_vitrine tail -f storage/logs/laravel.log
```

**Frontend (console navigateur) :**
- Network tab pour les requêtes
- Console pour les erreurs JavaScript

---

## 🔧 Maintenance et contribution

### Maintenance régulière

#### Mise à jour des dépendances

**Frontend :**
```bash
cd front
npm outdated
npm update
npm audit fix
```

**Backend :**
```bash
cd back
composer outdated
composer update
```

#### Nettoyage

**Docker :**
```bash
# Supprimer les conteneurs arrêtés
docker-compose down

# Nettoyer les images non utilisées
docker image prune -a

# Nettoyer les volumes non utilisés
docker volume prune
```

**Laravel :**
```bash
# Nettoyer les caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Tests

#### Frontend

**Lancer le linter :**
```bash
cd front
npm run lint
```

**Build de test :**
```bash
npm run build
npm run preview
```

#### Backend

**Tests unitaires :**
```bash
cd back
php artisan test
```

**Linter PHP :**
```bash
./vendor/bin/pint
```

### Contribution

#### Workflow Git

1. **Créer une branche**
```bash
git checkout -b feature/ma-fonctionnalite
```

2. **Développer et tester**
```bash
# Développement...
npm run lint
php artisan test
```

3. **Commiter**
```bash
git add .
git commit -m "feat: ajout de ma fonctionnalité"
```

4. **Pousser et créer une PR**
```bash
git push origin feature/ma-fonctionnalite
```

#### Convention de commits

Format : `type(scope): message`

**Types :**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, indentation
- `refactor`: Refactorisation
- `test`: Ajout de tests
- `chore`: Tâches de maintenance

**Exemples :**
```
feat(plan): ajout de la vue calendrier
fix(search): correction du filtrage des accents
docs(readme): mise à jour de l'installation
refactor(hooks): simplification de usePlanData
```

### Ressources utiles

#### Documentation
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Laravel](https://laravel.com/docs)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)

#### Communauté
- Issues GitHub pour les bugs
- Discussions pour les questions
- Pull Requests pour les contributions

---

## 📝 Licence

Ce projet est développé pour un usage interne.

---

## 👥 Auteurs

Équipe de développement RAIN

---

## 🆘 Support

Pour toute question ou problème :
1. Consulter cette documentation
2. Vérifier les issues GitHub existantes
3. Créer une nouvelle issue si nécessaire

---

**Dernière mise à jour :** Janvier 2026
