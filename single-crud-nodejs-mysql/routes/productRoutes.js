// Définition des routes de l'application.
// On utilise uniquement GET et POST (formulaires HTML classiques).

const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

// Liste des produits (page d'accueil)
router.get('/', controller.index);

// Création
router.get('/products/new', controller.newForm);
router.post('/products', controller.create);

// Modification
router.get('/products/:id/edit', controller.editForm);
router.post('/products/:id', controller.update);

// Suppression
router.post('/products/:id/delete', controller.remove);

module.exports = router;
