# Frontend Plan VTOM

Cette application React/Vite expose une interface documentaire simplifiée autour du plan VTOM. Tout le comportement du front est drivé par un fichier JSON unique afin de pouvoir ajuster facilement les sections et les boîtes colorées sans écrire de TypeScript.

## Organisation

- `src/data/plan-data.json` : source unique de vérité pour les contenus (hero, sections d’accueil, liens rapides, colonnes du plan et paysage). Modifier ce fichier suffit à faire évoluer les boîtes et leurs couleurs.
- `src/composant/data.ts` : convertit le JSON en objets typés (`PlanDataPayload`) et expose des helpers (`planColumns`, `planApplications`, `getAppDetail`, etc.) utilisés partout dans l’UI.
- `src/composant/*.tsx` : composants UI découpés par responsabilité :
  - `AppLayout` gère la navigation (React Router) et les modales de recherche/selection.
  - `Home`, `Documentation`, `PlanPage` orchestrent chaque page.
  - `PlanBoard`, `PlanModal`, `TreatmentModal`, `AdvancedSearchModal`, `Hero`, `QuickAccess` représentent les blocs graphiques.
- `src/App.tsx` se contente de monter `AppLayout` dans le `BrowserRouter`.

Chaque composant UI consomme uniquement les données du JSON via `data.ts`, ce qui garantit que l’application reste cohérente avec vos modifications éditoriales.

## Flux de données

1. `plan-data.json` est importé dans `data.ts`.
2. Les données sont typées grâce aux interfaces du dossier `composant/types.ts`.
3. `AppLayout` injecte les sections, colonnes et landscape dans les pages/boîtes.
4. Les interactions (recherche avancée, sélection d’application, navigation) se propagent via des callbacks locaux afin de rester entièrement côté front.

## Scripts utiles

- `npm run dev` : lance Vite en mode développement.
- `npm run build` : build production pour vérifier que le typage et la configuration restent valides.
- `npm run lint` : vérifie les règles ESLint configurées.

## Modifier les boîtes du plan

1. Éditer `src/data/plan-data.json` (couleur, label, colonnes supplémentaires, traitements…).
2. Sauvegarder : Vite recharge automatiquement l’UI avec les nouvelles valeurs.

Toutes les docs et commentaires sont rédigés en français afin de simplifier la prise en main pour l’équipe.*** End Patch
