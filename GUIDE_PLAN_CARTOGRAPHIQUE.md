# 🗺️ Guide d'utilisation - Plan Cartographique VTOM

## Accès au plan

### Via le menu principal
1. Ouvrez l'application
2. Cliquez sur **"Plan Cartographique"** dans le menu Hero (en haut)
3. Le plan s'affiche avec toutes les applications VTOM

### Via l'URL directe
Accédez directement à : `http://votre-domaine/vtom-plan`

## Navigation dans le plan

### 🔍 Zoom
- **Bouton +** : Zoomer (agrandir la vue)
- **Bouton -** : Dézoomer (réduire la vue)
- **Bouton Reset** : Revenir à la vue initiale
- **Niveau affiché** : Indique le pourcentage de zoom actuel

### 🖱️ Déplacement (Pan)
1. Cliquez et maintenez le bouton gauche de la souris sur une zone vide
2. Déplacez la souris pour naviguer
3. Relâchez pour arrêter le déplacement

**Astuce** : Utilisez la minimap (bas droite) pour voir votre position globale

### 🔎 Recherche
1. Tapez le nom de l'application dans la barre de recherche
2. Le plan se filtre automatiquement
3. Seules les applications correspondantes s'affichent

## Informations affichées

### Sur chaque application
- **Nom** : Affiché au centre du rectangle
- **Couleur** : Correspond à la famille/type d'application
- **Statut** : Icône en bas
  - ✅ **Terminé** : Traitement complété avec succès
  - ⏳ **En attente** : Attend son tour d'exécution
  - ▶️ **En cours** : Traitement en cours d'exécution
  - 🔄 **Inconnu** : État non déterminé
- **Jobs** : Nombre de jobs associés

### Détails complets
Cliquez sur une application pour ouvrir la modale avec :
- Nom complet
- Famille
- Position exacte (x, y)
- Couleur (avec aperçu visuel)
- Cycle d'exécution (si activé)
- Nombre de jobs
- Commentaires éventuels

## Outils d'aide

### Légende (haut droite)
Explique la signification de chaque icône de statut :
- ✅ Terminé
- ⏳ En attente
- ▶️ En cours
- 🔄 Inconnu

### Minimap (bas droite)
- Vue globale de tout le plan
- Rectangle rouge = zone actuellement visible
- Toutes les applications en miniature

## Astuces d'utilisation

### Pour localiser rapidement une application
1. Utilisez la barre de recherche
2. Ou regardez la minimap pour identifier les zones denses

### Pour voir les détails
1. Zoomez sur la zone d'intérêt
2. Cliquez sur l'application
3. Consultez les informations dans la modale

### Pour une vue d'ensemble
1. Dézoomer au maximum
2. Utiliser la minimap pour naviguer

### Pour comparer plusieurs applications
1. Notez les couleurs (familles similaires)
2. Vérifiez les statuts (icônes)
3. Consultez le nombre de jobs

## Raccourcis clavier

Actuellement, la navigation se fait uniquement à la souris.

**Évolutions prévues** :
- Flèches directionnelles pour le déplacement
- +/- pour le zoom
- Échap pour fermer la modale
- Ctrl+F pour la recherche

## Résolution de problèmes

### Le plan ne s'affiche pas
- Vérifiez que le fichier `tours.json` est présent
- Rechargez la page (F5)
- Videz le cache du navigateur

### Les applications ne s'affichent pas
- Vérifiez les filtres de recherche
- Cliquez sur "Reset" pour revenir à la vue initiale
- Vérifiez la console pour des erreurs

### Le déplacement ne fonctionne pas
- Assurez-vous de cliquer sur une zone vide (pas sur une application)
- Le curseur doit se transformer en main

### La modale ne s'ouvre pas
- Cliquez bien au centre de l'application
- Vérifiez que le navigateur n'est pas en mode responsive mobile

## Support navigateurs

| Navigateur | Version minimale | Statut |
|------------|------------------|--------|
| Chrome | 90+ | ✅ Supporté |
| Firefox | 88+ | ✅ Supporté |
| Safari | 14+ | ✅ Supporté |
| Edge | 90+ | ✅ Supporté |

## Contact et assistance

Pour toute question ou problème :
- Consultez la documentation développeur
- Contactez l'équipe support VTOM
- Créez une issue sur le dépôt Git

---

**Bonne navigation dans le plan VTOM ! 🚀**
