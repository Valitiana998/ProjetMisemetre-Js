# Ar Finance Manager

Application web de gestion financière personnelle en Ariary malgache (Ar), développée en HTML/CSS/JS vanille avec stockage local (`localStorage`).

---

## 📁 Structure du projet

```
ProjetMisemesetre/
└── public/
    ├── html/
    │   ├── index.html          → Tableau de bord (Dashboard)
    │   ├── transactions.html   → Saisie et gestion du budget
    │   ├── historique.html     → Historique des transactions
    │   ├── goals.html          → Objectifs financiers
    │   ├── addDepenese.html    → Formulaire d'ajout de dépense
    │   ├── addObjectif.html    → Formulaire d'ajout d'objectif
    │   ├── reports.html        → Rapports et statistiques
    │   └── settings.html       → Paramètres (catégories, données)
    ├── css/
    │   ├── main.css            → Styles globaux (sidebar, stats, layout)
    │   ├── settings.css        → Styles page Paramètres
    │   ├── goals.css           → Styles page Objectifs
    │   ├── historique.css      → Styles page Historique
    │   ├── transactions.css    → Styles page Budget/Transactions
    │   ├── reports.css         → Styles page Rapports
    │   ├── budget.css          → Styles composants budget
    │   ├── addDepense.css      → Styles formulaire dépense
    │   └── addTransaction.css  → Styles formulaire transaction
    └── js/
        ├── main.js             → Navigation mois (partagé)
        ├── dashboard.js        → Logique tableau de bord + graphiques
        ├── transaction.js      → Gestion des transactions (CRUD)
        ├── historique.js       → Affichage et filtrage de l'historique
        ├── goals.js            → Affichage et mise à jour des objectifs
        ├── add-goals.js        → Formulaire création d'objectif
        ├── addDepense.js       → Formulaire ajout de dépense
        ├── reports.js          → Calcul et affichage des rapports
        └── settings.js         → Gestion catégories + préférences
```

---

## ✨ Fonctionnalités

### 🏠 Tableau de bord (`index.html`)
- Affichage du **solde actuel**, des **revenus** et des **dépenses** du mois sélectionné
- **Navigation par mois** (boutons `‹` / `›`)
- **Graphique camembert** de répartition des dépenses par catégorie (Chart.js)
- Liste des **transactions récentes** du mois
- **Objectifs financiers** avec barres de progression
- Bouton flottant (`+`) pour ajouter une transaction

### 💳 Budget / Transactions (`transactions.html`)
- Formulaire d'ajout de transactions (revenu ou dépense)
- Sélection du **type** (revenu/dépense), **catégorie**, **montant**, **date**, **description**
- **Modification** et **suppression** des transactions
- Affichage du **solde net**, total entrées, total dépenses du mois
- Navigation par mois

### 📜 Historique (`historique.html`)
- Liste complète de toutes les transactions passées
- **Filtrage** par type (revenu/dépense) et par catégorie
- **Recherche** textuelle sur les descriptions
- Pagination ou scroll infini

### 🎯 Objectifs (`goals.html`)
- Affichage des objectifs avec **barre de progression**
- **Statuts** : En cours / Atteint / En pause
- Détail de l'objectif : montant cible, montant actuel, date limite
- Possibilité d'**ajouter des fonds** à un objectif existant

### ➕ Ajouter un objectif (`addObjectif.html`)
- Formulaire : nom, montant cible, montant initial, date limite, catégorie

### ➕ Ajouter une dépense (`addDepenese.html`)
- Formulaire rapide pour enregistrer une dépense avec catégorie et sous-catégorie

### 📊 Rapports (`reports.html`)
- Statistiques et résumés financiers
- Graphiques comparatifs

### ⚙️ Paramètres (`settings.html`)
- **Gestion des catégories** : créer, modifier, supprimer des catégories et sous-catégories
- **Choix de couleur** par catégorie
- **Exporter** toutes les données en JSON
- **Réinitialiser** toutes les données (transactions, objectifs)

---

## 🛠️ Technologies utilisées

| Technologie | Rôle |
|-------------|------|
| HTML5       | Structure des pages |
| CSS3        | Mise en forme (thème sombre/clair) |
| JavaScript (Vanilla ES6+) | Logique applicative |
| [Chart.js](https://www.chartjs.org/) | Graphiques (camembert, barres) |
| `localStorage` | Persistance des données côté client |

---

## 🚀 Lancement

Aucune installation requise. Il suffit d'ouvrir le fichier `public/html/index.html` dans un navigateur moderne.

```bash
# Ou via un serveur local simple
npx serve public/
# ou
python3 -m http.server 8000 --directory public/
```

---

## 🌙 Mode Sombre / ☀️ Mode Clair

L'application supporte un **thème sombre** (par défaut) et un **thème clair**.

Le bouton de bascule se trouve dans la **sidebar** (icône 🌙/☀️) et dans la page **Paramètres**.

La préférence est sauvegardée dans `localStorage` sous la clé `theme` et appliquée automatiquement à chaque page au chargement via `main.js`.

---

## ⚠️ Limites connues

### 1. Pas de backend ni de base de données
Toutes les données sont stockées dans le `localStorage` du navigateur. Si l'utilisateur vide le cache ou change de navigateur, toutes les données sont perdues.

### 2. Données non synchronisées entre pages
La navigation par mois dans `main.js` et `dashboard.js` est dupliquée : les deux fichiers déclarent indépendamment `currentMonth` et `currentYear`, ce qui peut créer des conflits si les deux scripts s'exécutent sur la même page.

### 3. Aucune authentification
L'application n'a pas de système de connexion. Toutes les données sont accessibles à quiconque utilise le même navigateur.

### 4. Montants non validés
Les formulaires ne bloquent pas les montants négatifs ou les valeurs aberrantes. Une dépense de `-999999 Ar` est acceptée sans avertissement.

### 5. Devise fixe (Ariary)
La devise est codée en dur (`Ar`) dans la majorité des fonctions JS (`formatAr()`). Le paramètre `pref_currency` est sauvegardé mais n'est pas utilisé pour convertir ou changer l'affichage.

### 6. Pas de support hors-ligne (PWA)
Il n'y a pas de Service Worker ni de manifest. L'application nécessite une connexion internet pour charger Chart.js depuis un CDN.

### 7. Responsive incomplet
La mise en page est prévue pour desktop. Certaines pages (objectifs, paramètres) ne sont pas entièrement adaptées aux écrans mobiles.

### 8. Pas de pagination dans l'historique
Si l'utilisateur accumule des centaines de transactions, toutes sont rendues dans le DOM en même temps, ce qui peut ralentir le navigateur.

### 9. Fautes de frappe dans le code
Le fichier `addDepenese.html` (au lieu de `addDepense.html`) et quelques noms de variables contiennent des coquilles.

### 10. Importation de données non implémentée
La page Paramètres permet d'**exporter** les données en JSON mais ne propose pas de fonctionnalité d'**importation**, rendant la sauvegarde peu exploitable.

---

## 👥 Auteurs

Projet de mi-semestre — 2026
