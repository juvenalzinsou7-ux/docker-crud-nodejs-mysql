// Point d'entrée de l'application.
// Architecture MVC : server.js (config) -> routes -> controllers -> models -> views

const express = require('express');
const path = require('path');
const { initDatabase } = require('./config/db');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Moteur de vues EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Lecture des données de formulaire (POST) et fichiers statiques (CSS)
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes de l'application
app.use('/', productRoutes);

// Gestion centralisée des erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Erreur serveur : ' + err.message);
});

// On initialise la base de données AVANT de démarrer le serveur HTTP.
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Application démarrée sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Impossible d'initialiser la base de données :", err.message);
    process.exit(1);
  });
