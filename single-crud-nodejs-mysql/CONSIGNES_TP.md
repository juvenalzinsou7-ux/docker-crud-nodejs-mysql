# TP - Introduction à Docker

**ESGIS - Licence 2 Sécurité Informatique - Année 2025-2026**

---

## Contexte

On vous fournit une application web **CRUD** de gestion d'inventaire de produits, écrite en
**Node.js (MVC)** et utilisant une base de données **MySQL** : le projet
**`single-crud-nodejs-mysql`**.

Le fichier **`README.md`** à la racine du projet est votre **source de vérité** : il contient
toutes les informations dont vous avez besoin (versions de Node et de MySQL, variables
d'environnement, port, commande de démarrage). **Lisez-le avant de commencer.**

> L'application a été testée et fonctionne. Vous n'avez **aucune ligne de code à modifier**.
> Votre travail consiste à la **dockeriser**.

> **À propos des images :** le `README.md` vous donne les **versions** (Node, MySQL). C'est à
> vous d'aller trouver le **tag exact** correspondant à chaque version.
> Utilisez toujours un tag précis et complet, jamais `latest`.

---

## Consignes

Réalisez les étapes **dans l'ordre**. Les étapes 1 à 6 doivent se faire via des commandes
`docker` une par une, puis vous passerez à `docker-compose`.

### 1. Réseau Docker
Créer un réseau Docker nommé **`l2si`**.

### 2. Volume nommé Docker
Créer un **volume nommé** Docker nommé **OBLIGATOIREMENT** **`db-data`**.

Ce volume servira à **persister les données** de la base MySQL : même si le conteneur `db` est
supprimé puis recréé, les données seront conservées dans ce volume.

> Il doit s'agir d'un **volume nommé** (`docker volume create db-data`), et **non** d'un montage
> de type « bind mount » (chemin du disque). Un volume anonyme n'est pas accepté.

### 3. Dockerfile et construction de l'image
Dockeriser l'application Node.js en ajoutant un fichier **`Dockerfile`** à la racine du projet
`single-crud-nodejs-mysql`, puis construire l'image.

L'image construite doit être **taguée** de façon explicite et peut être incrémentée logiquement si vous êtes amené à faire plusieurs build: **`crud-app:1.0`**
(jamais sans tag, jamais `latest`).

### 4. Conteneur de base de données « db »
Démarrer un conteneur avec l'image **MySQL 8.0** en l'ajoutant dans le réseau `l2si`.
Le conteneur doit **OBLIGATOIREMENT** être nommé **`db`**.

Le conteneur `db` doit utiliser le **volume nommé `db-data`** créé à l'étape 2, monté sur le
répertoire de données de MySQL : **`/var/lib/mysql`**.

> Reportez-vous au `README.md` pour les variables d'environnement attendues par MySQL.
> **Remarque :** l'application se connecte directement à MySQL 8.0. Aucune option
> d'authentification particulière n'est à ajouter à la commande `docker run`.

### 5. Conteneur de l'application « crud-app »
Démarrer un conteneur à partir de l'image `crud-app:1.0` construite à l'étape 3. Le conteneur
doit **OBLIGATOIREMENT** être nommé **`crud-app`**, être placé dans le réseau `l2si`, et être
**connecté** au conteneur `db`.

Vérifier que l'application est accessible depuis le navigateur (port indiqué dans le `README.md`).

### 6. Ajouter une donnée témoin
Depuis le navigateur, **ajoutez un produit** de votre choix (par exemple un produit nommé
`GROUPE-1` ou autre chose). Cette donnée servira à **prouver la persistance** un peu plus loin.

### 7. Nettoyage avant `docker-compose`
Vous allez maintenant relancer la même infrastructure avec `docker-compose`. Pour éviter les
conflits de noms, **supprimez d'abord** :

- le conteneur **`crud-app`**,
- le conteneur **`db`**,
- le réseau **`l2si`**.

> **ATTENTION : ne supprimez SURTOUT PAS le volume `db-data`.** Il contient vos données
> (dont le produit témoin ajouté à l'étape 6). C'est tout l'intérêt d'un volume nommé : il
> survit à la suppression des conteneurs.

### 8. docker-compose
Créer un fichier **`docker-compose.yml`** à la racine du projet `single-crud-nodejs-mysql` et y
ajouter les services **`crud-app`** et **`db`**.

Le service `db` doit réutiliser le **volume nommé `db-data`** (monté sur `/var/lib/mysql`).

Le fichier `docker-compose.yml` doit être capable de lancer l'application `crud-app` avec son
serveur de base de données `db` **en une seule commande**.

### 9. Vérifier la persistance des données
Une fois les services démarrés via `docker-compose`, ouvrez l'application dans le navigateur.

Le **produit témoin** ajouté à l'étape 6 doit **toujours être présent** : il a été conservé
grâce au volume nommé `db-data`, alors même que les conteneurs ont été détruits et recréés.

### 10. Captures d'écran
Créer un répertoire nommé **`captures`** à la racine du projet `single-crud-nodejs-mysql`.
Y ajouter les captures suivantes :

- Build de l'image à partir du `Dockerfile`
- Résultat de la commande `docker images` ou `docker image ls` montrant votre image **`crud-app:1.0`**
- Résultat de la commande permettant de lister les réseaux Docker (le réseau `l2si` doit y figurer)
- Commande de **création du volume `db-data`** ainsi que le résultat de son exécution
- Résultat de la commande permettant **d'afficher la liste des volumes Docker** (le volume `db-data` doit y figurer)
- Résultat de la commande permettant **d'afficher le détail (inspect) du volume `db-data`**
- Commande `docker run` du conteneur `db` ainsi que le résultat de son exécution
- Commande `docker run` du conteneur `crud-app` ainsi que le résultat de son exécution
- Résultat de la commande permettant d'afficher les conteneurs en cours d'exécution
- Résultat de la commande **`docker logs crud-app`** (on doit y voir « Application démarrée » et la connexion réussie à la base)
- L'application affichée dans le navigateur, **avec votre produit témoin** ajouté à l'étape 6
- Commande de **nettoyage** de l'étape 7 (suppression des conteneurs et du réseau, le volume étant conservé)
- Résultat de la commande qui démarre les services à partir du `docker-compose.yml`
- L'application affichée dans le navigateur **après `docker-compose`**, montrant que **le produit témoin est toujours présent** (preuve de la persistance)

### 11. Archive et envoi
Compresser votre projet en le nommant **`single-crud-nodejs-mysql-si-g1-NUMERO_GROUPE.zip`**
(exemple pour le groupe 10 : `single-crud-nodejs-mysql-si-g1-10.zip`).

L'archive **DOIT** contenir :
- les sources du projet,
- les fichiers `Dockerfile` et `docker-compose.yml`,
- le répertoire `captures` avec toutes les captures demandées.

Envoyez votre travail à **osquem@yahoo.fr**.

L'objet de votre mail doit **OBLIGATOIREMENT** être sous la forme :

```
TP_L2SIG1_GROUPE{NUMERO_DU_GROUPE}_2025_2026
```

(exemple pour le groupe 1 : `TP_L2SIG1_GROUPE1_2025_2026`)

Ajoutez dans le **corps** du mail la **liste des membres** de votre groupe (nom et prénom).

### À vérifier IMPÉRATIVEMENT avant d'envoyer

- [ ] Le fichier `.zip` ou `.tar.gz` est nommé **exactement** `single-crud-nodejs-mysql-si-g1-NUMERO_GROUPE.zip`.
- [ ] L'objet du mail est nommé **exactement** `TP_L2SIG1_GROUPE{NUMERO_DU_GROUPE}_2025_2026`.
- [ ] L'archive contient **tous** les éléments : sources, `Dockerfile`, `docker-compose.yml`,
      et le répertoire `captures` complet. **Prenez la peine de vérifier.**
- [ ] **Le fichier compressé est bien JOINT au mail** (pièce jointe) avant de cliquer sur « Envoyer ».
- [ ] Les **membres du groupe** sont listés dans le corps du mail.

---

## Pénalités (points retirés automatiquement)

Le respect des consignes fait partie de la note. Les manquements suivants sont **systématiquement
sanctionnés** :

| Manquement | Sanction |
|-----------|----------|
| Objet du mail non conforme à `TP_L2SI_GROUPE{NUMERO}_2025_2026`
| Nom de l'archive `.zip` ou `.tar.gz` non conforme
| Archive incomplète (sources, Dockerfile, docker-compose.yml ou captures manquants)
| Pièce jointe oubliée / mail sans le fichier compressé
| **Envois multiples** (plusieurs mails pour le même groupe)
| **Envoi hors délai** (après l'heure limite) | **Points en moins systématiquement** |

> Un seul envoi par groupe. Vérifiez tout **avant** d'envoyer : un mail envoyé ne peut pas
> être corrigé par un second envoi sans pénalité.

---

## Rappels importants

- Respectez **scrupuleusement** les noms imposés : réseau `l2si`, volume `db-data`,
  conteneurs `db` et `crud-app`, image `crud-app:1.0`.
- La **source de vérité** est le `README.md` du projet : versions, variables, port, etc ...
- **Tags d'images :** le `README.md` donne les **versions** ; à vous de trouver le **tag exact**
  correspondant. Toujours un tag précis et complet, jamais `latest` ni un tag flottant.
- **Ne supprimez jamais le volume `db-data`** pendant le TP : il porte la preuve de persistance.
- Un seul envoi par groupe.
