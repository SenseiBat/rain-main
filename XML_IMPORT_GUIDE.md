# Import de fichiers XML VTOM

## 📋 Vue d'ensemble

Cette fonctionnalité permet d'importer des fichiers XML exportés depuis Visual TOM et de les visualiser automatiquement dans l'interface du plan VTOM.

## 🚀 Comment utiliser

### 1. Exporter depuis Visual TOM

1. Ouvrez Visual TOM
2. Sélectionnez votre environnement/domaine
3. Utilisez la fonction d'export XML (généralement `Fichier > Exporter > Format XML`)
4. Sauvegardez le fichier (ex: `tours.xml`)

### 2. Importer dans l'application

1. Accédez à la page **Plan VTOM** (`/plan`)
2. Cliquez sur le bouton **"📁 Importer XML"** en haut à droite
3. Glissez-déposez votre fichier XML ou cliquez pour parcourir
4. Vérifiez l'aperçu du fichier
5. Cliquez sur **"Importer"**

### 3. Visualiser les données

Une fois importé, le plan se met automatiquement à jour avec :

- **Applications** regroupées par famille (colonnes)
- **Traitements** et leurs jobs associés
- **Paysage** organisé par statut et famille
- **Serveurs** (hosts) extraits du XML

## 📊 Structure XML supportée

Le parser supporte les balises suivantes :

```xml
<Domain>
  <Applications>
    <Application name="..." family="..." status="..." frequency="...">
      <Jobs>
        <Job name="..." comment="..." script="...">
          <Script>
            <Command>...</Command>
          </Script>
        </Job>
      </Jobs>
    </Application>
  </Applications>
  <Hosts>
    <Host name="..." hostname="..." comment="..."/>
  </Hosts>
</Domain>
```

## 🎨 Codes couleur des statuts

Les applications sont colorées selon leur statut VTOM :

- 🟠 **W** (Waiting) - Orange : En attente
- 🟢 **E** (Executed) - Vert : Exécuté avec succès
- 🔵 **D** (Done) - Bleu : Terminé
- ⚪ **U** (Unknown/Unused) - Gris : Non utilisé (masqué par défaut)
- 🟡 **O** (On Hold) - Orange foncé : En pause
- 🔴 **R** (Running) - Rouge : En cours d'exécution

## ⚙️ Fonctionnalités techniques

### Parser XML (`src/utils/xmlParser.ts`)

Le parser extrait automatiquement :

- **Applications** : nom, famille, commentaire, fréquence, statut, mode
- **Jobs** : nom, script, host group, utilisateur, statut
- **Hosts** : nom, hostname, commentaire, OS
- **Relations** : jobs associés à leurs applications

### Validation

Le fichier XML est validé avant import :

- ✅ Format XML correct
- ✅ Présence de la balise `<Domain>` racine
- ✅ Taille max : 10 MB
- ✅ Extension : `.xml`

### Organisation automatique

Les données sont automatiquement organisées en :

1. **Colonnes** : Applications regroupées par `family`
2. **Détails** : Traitements et jobs extraits
3. **Paysage** : Vue par statut et par famille

## 📝 Exemple avec tours.xml

Le fichier `tours.xml` fourni contient :

- **82 applications** réparties dans la famille `EXPLOIT_SLR`
- **Multiples jobs** par application avec leurs scripts
- **2 serveurs** : `paypgsa240.paya` et `paypgsd311.paya`
- **Calendriers** et dates de traitement

Import type :

```bash
Applications importées: 82
Familles: EXPLOIT_SLR, AUTRES
Statuts: W (Waiting), E (Executed), D (Done), U (Unused)
Serveurs: 2
```

## 🔄 Réinitialisation

Pour revenir aux données par défaut :

1. Rechargez la page (F5)
2. Les données du fichier `plan-data.json` seront restaurées

> **Note** : L'import est temporaire et stocké uniquement en mémoire. Les données ne sont pas persistées entre les sessions.

## 🛠️ Personnalisation

### Ajouter des champs personnalisés

Modifiez `src/utils/xmlParser.ts` pour extraire des attributs supplémentaires :

```typescript
// Exemple : ajouter le champ "priority"
const priority = appNode.getAttribute('priority') || 'normal'
```

### Changer les couleurs

Modifiez la fonction `getStatusColor()` dans `xmlParser.ts` :

```typescript
const statusColors: Record<string, string> = {
  W: '#FFA500', // Orange
  E: '#4CAF50', // Vert
  // Ajoutez vos propres codes couleur
}
```

### Modifier le regroupement

Par défaut, les applications sont regroupées par `family`. Pour changer :

```typescript
// Dans buildPlanColumns(), remplacez :
const family = app.family || 'AUTRES'
// Par votre propre critère, exemple :
const group = app.frequency || 'DAILY'
```

## 🐛 Dépannage

### Erreur "Format XML invalide"

- Vérifiez que le fichier est bien au format XML
- Utilisez un validateur XML en ligne
- Assurez-vous que le fichier est encodé en UTF-8

### Erreur "Aucune application trouvée"

- Vérifiez la présence de balises `<Application>` dans le XML
- Consultez les logs du navigateur (F12 > Console)

### Le fichier ne s'affiche pas

- Vérifiez la taille du fichier (max 10 MB)
- Testez avec un fichier plus petit
- Vérifiez l'extension (doit être `.xml`)

## 📚 Architecture

```
src/
├── utils/
│   └── xmlParser.ts          # Parser XML et conversion de données
├── components/
│   ├── XMLImportModal.tsx    # Modale d'import avec drag & drop
│   ├── PlanPage.tsx          # Page principale avec gestion import
│   └── PlanBoard.tsx         # Affichage avec bouton import
└── contexts/
    └── PlanDataProvider.tsx  # Context avec état dynamique
```

## 🎯 Prochaines étapes

- [ ] Ajouter la persistance en localStorage
- [ ] Supporter le format JSON VTOM
- [ ] Export des données modifiées
- [ ] Édition inline des applications
- [ ] Historique des imports

## 📖 Ressources

- [Documentation Visual TOM](https://www.absyss.com/)
- [Format XML VTOM](https://www.absyss.com/documentation/format-xml)
- [React Context API](https://react.dev/reference/react/useContext)

---

**Version** : 1.0.0  
**Dernière mise à jour** : 15 décembre 2024
