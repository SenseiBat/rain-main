import { Section } from '../composant/types'

// Documentation détaillée des principaux fichiers front-end.
export const codeDocumentationSections: Section[] = [
  {
    id: 'app',
    title: 'App.tsx',
    description:
      "Point d'entrée React : monte l'application dans BrowserRouter, branche le provider des données statiques puis le ThemeProvider avant d'afficher AppLayout.",
    highlights: [
      'Garantit une navigation SPA via react-router-dom',
      'Expose tout le sous-arbre aux données PlanData',
      'Enveloppe l’UI avec la gestion claire/sombre',
    ],
  },
  {
    id: 'layout',
    title: 'AppLayout.tsx',
    description:
      "Orchestre la navigation et les états d'interface : gestion des routes, des modales de recherche et synchronisation de la sélection issue de la recherche avec la page plan.",
    highlights: [
      'Utilise usePlanData pour récupérer contenus et callbacks',
      'Routeur principal avec Home, Documentation et Plan',
      'Coordonne ouverture/fermeture de la recherche avancée',
    ],
  },
  {
    id: 'theme-provider',
    title: 'ThemeProvider.tsx & ThemeToggleButton.tsx',
    description:
      'ThemeProvider stocke la préférence clair/sombre (localStorage + media query) et applique data-theme sur <html>. ThemeToggleButton fournit un bouton ghost iconique accessible pour basculer.',
    highlights: [
      'Synchronisation DOM + persistance et animation globale',
      'Respecte les préférences système si aucune valeur stockée',
      'Bascule aria-friendly avec feedback visuel/emoji',
    ],
  },
  {
    id: 'hero',
    title: 'Hero.tsx & GhostButton.tsx',
    description:
      'Le bandeau hero affiche logo, baseline et CTA. GhostButton est le bouton stylisé partagé (état actif, variantes, texte masqué pour certains usages).',
    highlights: [
      'CTA reliés à react-router via callbacks',
      'Gestion accentuée des états actifs/pressed',
      'Compatibilité accessibilité (aria-label, sr-only)',
    ],
  },
  {
    id: 'home',
    title: 'Home.tsx & QuickAccess.tsx',
    description:
      'Home compose les sections éditoriales et l’accès rapide. QuickAccess rend des cartes paramétrées (accent dynamique, CTA, support du clic pour lancer la recherche).',
    highlights: [
      'Réutilise ContentSections pour le contenu statique long',
      'Animations légères pour les cartes rapides',
      'Props strict typées Section/QuickLink',
    ],
  },
  {
    id: 'documentation',
    title: 'Documentation.tsx & ContentSections.tsx',
    description:
      "Documentation réutilise ContentSections pour afficher les blocs métier. ContentSections prend une liste Section et affiche titres, description et puces avec animation.",
    highlights: [
      'Mutualisation des layouts éditoriaux',
      'Structure flexible (titre, description, highlights)',
      'Animations CSS cohérentes avec le reste du site',
    ],
  },
  {
    id: 'plan-data',
    title: 'PlanDataProvider.tsx & usePlanData.ts',
    description:
      "Charge plan-data.json, expose les colonnes, le paysage et la map détaillée via contexte. usePlanData sécurise l'accès au contexte et fourni les valeurs typées.",
    highlights: [
      'Pré-calcul des entrées pour la recherche (colonnes + paysage)',
      'Helper getAppDetail avec fallback par défaut',
      'Isolation du hook pour respecter Fast Refresh',
    ],
  },
  {
    id: 'plan',
    title: 'PlanBoard.tsx, PlanPage.tsx & PlanPill.tsx',
    description:
      "PlanPage assemble PlanBoard, gère sélection initiale et modales. PlanBoard affiche colonnes, paysage et CTA de navigation. PlanPill rend une pilule interactive (muted/interactive) avec couleur personnalisée.",
    highlights: [
      'Propagation des clics vers PlanModal/TreatmentModal',
      'Gestion responsive des colonnes et du paysage',
      'Custom properties CSS pour les couleurs dynamiques',
    ],
  },
  {
    id: 'modals',
    title: 'PlanModal.tsx & TreatmentModal.tsx',
    description:
      "PlanModal affiche le détail d'une application (chaîne de traitements + navigation). TreatmentModal zoome sur un traitement avec liste de jobs, animations d'ouverture/fermeture et gestion clavier.",
    highlights: [
      'Animations CSS personalisées (modal-pop) et overlay',
      'Navigation entre modales et bouton retour cohérent',
      'Focus management basique via attributs et boutons ghost',
    ],
  },
  {
    id: 'advanced-search',
    title: 'AdvancedSearchModal.tsx',
    description:
      'Modale plein écran permettant de filtrer toutes les applications (colonnes + paysage). Gère focus automatique, fermeture par Escape, navigation clavier et sélection rapide.',
    highlights: [
      'useMemo pour la normalisation et les résultats filtrés',
      'Handlers clavier (Enter, Escape) avec nettoyage propre',
      'Liste scrollable ergonomique pour grands volumes',
    ],
  },
  {
    id: 'styles',
    title: 'App.css & index.css',
    description:
      'index.css définit la typographie, background global et variable de transition. App.css contient tout le design system (hero, cartes, plan, modales) et décline les palettes sombre/clair.',
    highlights: [
      'Mode clair inspiré de la charte État + mode sombre original',
      'Transitions paramétrées pour les bascules de thème',
      'Animations partagées (fadeSlideIn, modal-pop)',
    ],
  },
  {
    id: 'assets',
    title: 'plan-data.json',
    description:
      'plan-data.json regroupe toutes les données métier (hero, sections, plan, détails). Il alimente PlanDataProvider et peut être édité par les équipes fonctionnelles.',
    highlights: [
      'Fichier unique facilement éditable par les équipes métier',
      'Sépare les données de présentation du code React',
      'Compatible avec le typage strict PlanDataPayload',
    ],
  },
  {
    id: 'types',
    title: 'types.ts',
    description:
      'Centralise tous les types TypeScript utilisés par les composants : structures éditoriales, colonnes du plan, paysage, détails des traitements, ainsi que les helpers comme CSSVarProperties.',
    highlights: [
      'Garantit un contrat unique entre JSON et composants React',
      'Documente les variations du paysage (stack, grid, connection…)',
      'Évite la duplication des interfaces dans les composants',
    ],
  },
]

export default codeDocumentationSections
