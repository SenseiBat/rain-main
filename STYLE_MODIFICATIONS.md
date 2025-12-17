# Modifications de Style - Thème France

## Objectif
Adapter l'interface pour utiliser la police officielle Marianne et les couleurs du drapeau français.

## Changements effectués

### 1. Police Marianne
- **Fichier**: `front/index.html`
- Ajout de la police Marianne via Bunny Fonts (alternative RGPD-friendly à Google Fonts)
- La police Marianne est maintenant la police principale de l'application

### 2. Couleurs du Drapeau Français

#### Variables CSS ajoutées dans `front/src/index.css`:
```css
--color-bleu-france: #000091        /* Bleu officiel de la République */
--color-blanc-france: #FFFFFF       /* Blanc */
--color-rouge-france: #E1000F       /* Rouge officiel */

/* Variations pour les interfaces */
--color-bleu-france-light: #6A6AF4  /* Bleu clair */
--color-bleu-france-dark: #000074   /* Bleu foncé */
--color-rouge-france-light: #FF5C6B /* Rouge clair */
--color-rouge-france-dark: #C1000D  /* Rouge foncé */
```

### 3. Éléments modifiés

#### Background général (`body`)
- Dégradé bleu France avec touches de rouge
- Effet subtil rappelant les couleurs tricolores

#### Composants `.hero`
- Background: Dégradé de bleu France (foncé → standard → clair)
- Box-shadow: Teinte bleue France

#### Composants `.page`
- Background: Dégradé avec bleu et rouge France
- Atmosphère patriotique et moderne

#### Boutons `.ghost-btn--primary`
- Background: Dégradé bleu France
- Couleur texte: Blanc France

#### Cartes `.quick-card`
- Accent color: Rouge France
- Background: Bleu France foncé semi-transparent
- Bordure supérieure: Rouge France

#### Pills `.plan-pill`
- Background: Bleu France
- Box-shadow: Teinte bleue

#### Board `.plan-board`
- Background: Dégradé bleu France complet
- Harmonisation des teintes

#### Accès rapide `.quick-access`
- Background: Dégradé bleu France profond
- Box-shadow avec teinte bleue France

## Résultat
L'application arbore désormais un design moderne aux couleurs de la République Française, avec la typographie officielle Marianne, tout en conservant une excellente lisibilité et une expérience utilisateur fluide.

## Mode Thème
**Changement important** : Le mode clair est maintenant le mode par défaut au lancement du site.
- **Fichier modifié** : `front/src/contexts/ThemeProvider.tsx`
- L'état initial du thème est défini sur `'light'` au lieu de `'dark'`
- Le système ignore maintenant la préférence système (`prefers-color-scheme`) et utilise le mode clair par défaut
- Les utilisateurs peuvent toujours basculer manuellement entre les modes via le bouton de bascule de thème

## Améliorations apportées

### Logo de la République française
**Ajout** : Logo officiel de la République française en bas de page
- **Fichiers créés** : 
  - `front/src/components/Footer.tsx` - Nouveau composant Footer
- **Fichiers modifiés** :
  - `front/src/components/AppLayout.tsx` - Import et intégration du Footer
  - `front/src/App.css` - Styles pour `.app-footer` avec adaptation mode clair/sombre
- **Caractéristiques** :
  - Logo centré avec effet hover (zoom léger)
  - Texte "République Française" en dessous
  - Adaptation automatique aux thèmes clair et sombre
  - Séparation visuelle avec bordure supérieure
  - Hauteur du logo : 80px

### Visibilité des titres en mode clair
**Problème résolu** : Les titres `h3` dans les cartes d'accès rapide (`.quick-card`) n'étaient pas visibles en mode clair.
- **Fichier modifié** : `front/src/App.css`
- Ajout de la règle CSS : `:root[data-theme='light'] .quick-card h3 { color: var(--color-bleu-france); }`
- Les titres affichent maintenant le bleu France en mode clair, assurant une excellente lisibilité

## Tests
- ✅ Hot Module Replacement (HMR) fonctionnel
- ✅ Police Marianne chargée correctement
- ✅ Couleurs appliquées sur tous les composants
- ✅ Transitions et animations préservées
- ✅ Mode clair activé par défaut au lancement
- ✅ Titres des cartes d'accès rapide visibles en mode clair
- ✅ Logo de la République française affiché en bas de page
- ✅ Footer adaptatif selon le thème (clair/sombre)

---

## Guide Développeur

### Comment basculer le thème par défaut

Si vous souhaitez revenir au mode sombre par défaut :

1. Ouvrez `front/src/contexts/ThemeProvider.tsx`
2. Changez la ligne 28 :
   ```tsx
   const [theme, setTheme] = useState<Theme>('light')  // Mode clair
   ```
   en :
   ```tsx
   const [theme, setTheme] = useState<Theme>('dark')   // Mode sombre
   ```

### Personnalisation des couleurs

Les variables CSS des couleurs France sont définies dans `front/src/index.css` :
```css
--color-bleu-france: #000091
--color-blanc-france: #FFFFFF
--color-rouge-france: #E1000F
--color-bleu-france-light: #6A6AF4
--color-bleu-france-dark: #000074
--color-rouge-france-light: #FF5C6B
--color-rouge-france-dark: #C1000D
```

Vous pouvez ajuster ces valeurs pour personnaliser les teintes selon vos besoins.

### Nettoyage du cache utilisateur

Si un utilisateur avait déjà visité le site avec le mode sombre sauvegardé dans son `localStorage`, il devra :
1. Ouvrir la console du navigateur (F12)
2. Exécuter : `localStorage.removeItem('vtom-theme')`
3. Rafraîchir la page

Ou simplement utiliser le bouton de bascule de thème dans l'interface.
