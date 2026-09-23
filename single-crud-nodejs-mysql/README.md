# single-crud-nodejs-mysql

Petite application web **CRUD** (Create, Read, Update, Delete) de **gestion d'inventaire de produits**, écrite en **Node.js** suivant l'architecture **MVC**, et connectée à une base de données **MySQL**.

C'est l'application que vous devez **dockeriser** dans le cadre du TP « Introduction à Docker ».

> Ce README est votre **source de vérité**. Toutes les informations dont vous avez besoin pour démarrer l'application (en local ou dans Docker) s'y trouvent : versions, variables d'environnement, port, commande de démarrage.

---

## 1. Stack technique

| Composant | Version |
|-----------|---------|
| Node.js   | **20.18.1** |
| MySQL     | **8.0** |
| Gestionnaire de paquets | npm |

L'application utilise le paquet npm **`mysql2`** pour se connecter à la base. Ce paquet supporte **nativement** le mode d'authentification par défaut de MySQL 8.0 (`caching_sha2_password`).

> **Important :** aucune option du type `--default-authentication-plugin=mysql_native_password` n'est nécessaire. La connexion fonctionne directement avec l'image officielle de MySQL 8.0.

### Trouver les bonnes images

Le tableau ci-dessus vous donne les **versions** :

Choisissez toujours un **tag précis et complet**, jamais `latest` ni un tag flottant. Un tag imprécis peut tirer une version différente le jour de la correction et faire échouer le lancement.

---

## 2. Structure du projet (MVC)

```
single-crud-nodejs-mysql/
├── server.js                 # Point d'entrée (configuration Express + démarrage)
├── package.json              # Dépendances et script de démarrage
├── .env.example              # Exemple de variables d'environnement
├── config/
│   └── db.js                 # Connexion MySQL + création auto de la base et de la table
├── models/
│   └── productModel.js       # Requêtes SQL (la couche « Model »)
├── controllers/
│   └── productController.js   # Logique applicative (la couche « Controller »)
├── routes/
│   └── productRoutes.js       # Définition des routes HTTP
├── views/                    # Templates EJS (la couche « View »)
│   ├── index.ejs
│   ├── form.ejs
│   └── partials/
└── public/
    └── style.css             # Feuille de style
```

---

## 3. Variables d'environnement

L'application se configure **uniquement** via des variables d'environnement (aucune valeur sensible n'est codée en dur). Valeurs par défaut :

| Variable      | Défaut       | Description |
|---------------|--------------|-------------|
| `DB_HOST`     | `localhost`  | Hôte du serveur MySQL. En **local** : `localhost`. Dans **Docker** : le **nom du conteneur MySQL**. |
| `DB_PORT`     | `3306`       | Port de MySQL |
| `DB_USER`     | `root`       | Utilisateur MySQL |
| `DB_PASSWORD` | *(vide)*     | Mot de passe MySQL |
| `DB_NAME`     | `inventory`  | Nom de la base de données (créée automatiquement si elle n'existe pas) |
| `PORT`        | `3000`       | Port d'écoute de l'application web |

Un fichier `.env.example` est fourni. Pour un démarrage en local, copiez-le en `.env`.

> **Initialisation automatique :** au démarrage, l'application crée elle-même la base de données `inventory` et la table `products` si elles n'existent pas, puis insère 3 produits de démonstration. **Vous n'avez aucun script SQL à exécuter à la main.**

> **Robustesse :** si MySQL n'est pas encore prêt (cas fréquent au démarrage des conteneurs), l'application attend et réessaie automatiquement la connexion pendant environ 60 secondes.

---

## 4. Démarrage en local (sans Docker)

Pré-requis : **Node.js 20.18.1** et un serveur **MySQL 8.0** accessible.

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
#    (adaptez DB_PASSWORD selon votre serveur MySQL local)

# 3. Démarrer l'application
npm start
```

Ouvrez ensuite votre navigateur sur : **http://localhost:3000**

---

## 5. Fonctionnalités

L'application web permet de :

- **Lister** tous les produits (page d'accueil `/`)
- **Ajouter** un produit (nom, prix, quantité)
- **Modifier** un produit existant
- **Supprimer** un produit

| Méthode | Route                     | Rôle |
|---------|---------------------------|------|
| GET     | `/`                       | Liste des produits |
| GET     | `/products/new`           | Formulaire d'ajout |
| POST    | `/products`               | Créer un produit |
| GET     | `/products/:id/edit`      | Formulaire de modification |
| POST    | `/products/:id`           | Mettre à jour un produit |
| POST    | `/products/:id/delete`    | Supprimer un produit |

---

## 6. En vue de la dockerisation

Pour le TP, vous devrez écrire vous-mêmes le `Dockerfile` et le `docker-compose.yml`. Les informations utiles sont rappelées ci-dessous :

- **Image de base de l'application :** Node.js **20.18.1**.
- **Image de la base de données :** MySQL **8.0**.
- **Port exposé par l'application :** `3000`
- **Commande de démarrage :** `npm start`
- **Connexion à la base dans Docker :** mettez `DB_HOST` égal au **nom du conteneur MySQL** (les deux conteneurs doivent être sur le **même réseau Docker**).
- Pensez à fournir au conteneur de l'application les variables `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- Côté MySQL, l'image officielle attend au minimum la variable `MYSQL_ROOT_PASSWORD`.
- **Persistance des données MySQL :** le serveur stocke ses données dans le répertoire **`/var/lib/mysql`** du conteneur. Pour conserver les données entre deux exécutions, montez un **volume nommé** Docker sur ce répertoire.

> Reportez-vous à l'énoncé du TP pour la liste exacte des étapes à réaliser et à rendre.
