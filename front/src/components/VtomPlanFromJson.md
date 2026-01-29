# VtomPlanFromJson - Documentation

## 📋 Vue d'ensemble

`VtomPlanFromJson` est un composant React qui génère un plan VTOM interactif basé sur les données réelles du fichier `tours.json`. Contrairement au plan traditionnel qui utilise une structure prédéfinie, ce composant extrait les coordonnées exactes de chaque application pour créer une représentation cartographique fidèle.

## 🎯 Fonctionnalités

### Visualisation cartographique
- **Canvas SVG** : Plan vectoriel avec rendu haute qualité
- **Positionnement exact** : Chaque application est placée selon ses coordonnées (x, y) définies dans le JSON
- **Couleurs originales** : Respect des couleurs de fond définies dans les propriétés de chaque application
- **Tailles variables** : Largeur personnalisée pour chaque application

### Navigation interactive
- **Zoom** : Contrôles +/- pour zoomer/dézoomer (30% à 300%)
- **Pan (déplacement)** : Cliquer-glisser pour naviguer dans le plan
- **Reset** : Bouton pour revenir à la vue initiale
- **Minimap** : Carte miniature en bas à droite montrant la position actuelle

### Informations d'application
- **Nom** : Nom complet de l'application
- **Statut** : Icône indiquant l'état (✅ Terminé, ⏳ Attente, ▶️ En cours, 🔄 Inconnu)
- **Nombre de jobs** : Compteur des jobs associés
- **Clic** : Ouvre une modale détaillée avec toutes les informations

### Recherche et filtrage
- **Barre de recherche** : Filtrage en temps réel par nom d'application
- **Mise en évidence** : Les applications correspondantes sont affichées

### Légende
- Affichage permanent des icônes de statut avec leur signification

## 📊 Structure des données

Le composant extrait les données depuis `tours.json` :

```json
{
  "Domain": {
    "Environments": {
      "Environment": {
        "Applications": {
          "Application": [
            {
              "@name": "VALIDATION-AUTO",
              "@family": "EXPLOIT_SLR",
              "@status": "W",
              "@cycleEnabled": "1",
              "@cycle": "00:02:00",
              "Node": {
                "@x": "1760",
                "@y": "1610",
                "Properties": {
                  "Property": [
                    {
                      "@key": "background",
                      "@value": "#9932cc"
                    },
                    {
                      "@key": "width",
                      "@value": "220"
                    }
                  ]
                }
              },
              "Jobs": {
                "Job": [...]
              }
            }
          ]
        }
      }
    }
  }
}
```

## 🎨 Interface utilisateur

### Header
- Titre et description
- Barre de recherche
- Contrôles de zoom (+, -, Reset, niveau actuel)

### Canvas principal
- Grille de fond pour repères visuels
- Applications représentées par des rectangles colorés
- Nom de l'application en blanc centré
- Statut et nombre de jobs en bas

### Éléments flottants
- **Légende** (haut droite) : Explication des icônes
- **Minimap** (bas droite) : Vue d'ensemble avec rectangle rouge indiquant la zone visible

### Modale de détails
Affichée au clic sur une application :
- **Header** : Nom + badge de statut
- **Informations** :
  - Famille
  - Position (x, y)
  - Couleur (avec aperçu visuel)
  - Cycle (si activé)
  - Nombre de jobs
  - Commentaire (si présent)

## 🔧 Utilisation

### Intégration dans l'application

```tsx
import VtomPlanFromJson from './VtomPlanFromJson'

// Dans le router
<Route path="/vtom-plan" element={<VtomPlanFromJson />} />
```

### Navigation

Le composant est accessible via :
- URL directe : `/vtom-plan`
- Menu Hero : "Plan Cartographique"
- Footer : Lien "Plan Cartographique"

## 📐 Système de coordonnées

- **Origine** : (0, 0) en haut à gauche
- **Unités** : Pixels VTOM
- **Espace total** : ~3000px de large × ~7000px de haut
- **ViewBox dynamique** : S'adapte au niveau de zoom

## 🎭 Statuts d'application

| Statut | Code | Icône | Signification |
|--------|------|-------|---------------|
| Ended | E | ✅ | Traitement terminé avec succès |
| Waiting | W | ⏳ | En attente d'exécution |
| Running | R | ▶️ | En cours d'exécution |
| Unknown | U | 🔄 | État inconnu ou indéfini |

## 🎨 Personnalisation CSS

Les styles sont définis dans `VtomPlanFromJson.css` :

### Variables principales
- Couleurs de fond
- Styles de la grille
- Animations des modales
- Responsive design

### Classes importantes
```css
.vtom-plan-wrapper       /* Conteneur principal */
.vtom-plan-canvas        /* Canvas SVG */
.app-node                /* Nœud d'application */
.vtom-plan-legend        /* Légende */
.vtom-plan-minimap       /* Minimap */
.vtom-modal              /* Modale de détails */
```

## 🚀 Performance

### Optimisations
- **Filtrage intelligent** : Seules les applications filtrées sont rendues
- **Événements optimisés** : Débounce sur les mouvements de souris
- **SVG natif** : Rendu performant par le navigateur
- **Pas de re-renders inutiles** : useCallback et useMemo

### Limitations
- Charge complète des applications au montage
- Pas de virtualisation (toutes les applications sont dans le DOM)
- Convient pour ~50-200 applications

## 🐛 Débogage

### Console logs
Le composant log les erreurs d'extraction :
```javascript
console.error('Erreur lors de l\'extraction des applications:', error)
```

### Vérifications
- Le fichier `tours.json` est-il présent à la racine ?
- Les structures JSON sont-elles valides ?
- Les coordonnées sont-elles numériques ?

## 🔄 Évolutions possibles

### Court terme
- [ ] Filtrage par famille
- [ ] Filtrage par statut
- [ ] Export PNG/SVG du plan
- [ ] Mode plein écran

### Long terme
- [ ] Liens entre applications (dépendances)
- [ ] Groupement par zone géographique
- [ ] Timeline des exécutions
- [ ] Édition des positions
- [ ] Connexion temps réel avec VTOM

## 📚 Références

- **Composant** : `/front/src/components/VtomPlanFromJson.tsx`
- **Styles** : `/front/src/styles/VtomPlanFromJson.css`
- **Données** : `/tours.json`
- **Route** : `/vtom-plan`

## 👥 Auteurs

Développé pour le projet RAIN - Site Documentaire VTOM
