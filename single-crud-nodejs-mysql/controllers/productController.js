// Contrôleur « Product » : fait le lien entre les routes, le modèle et les vues.

const Product = require('../models/productModel');

// Liste de tous les produits.
async function index(req, res, next) {
  try {
    const products = await Product.getAll();
    res.render('index', { products });
  } catch (err) {
    next(err);
  }
}

// Affiche le formulaire de création.
function newForm(req, res) {
  res.render('form', {
    product: null,
    formAction: '/products',
    title: 'Ajouter un produit',
  });
}

// Crée un nouveau produit.
async function create(req, res, next) {
  try {
    const { name, price, quantity } = req.body;
    await Product.create({
      name: (name || '').trim(),
      price: Number(price) || 0,
      quantity: parseInt(quantity, 10) || 0,
    });
    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

// Affiche le formulaire de modification.
async function editForm(req, res, next) {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).send('Produit introuvable');
    }
    res.render('form', {
      product,
      formAction: `/products/${product.id}`,
      title: 'Modifier le produit',
    });
  } catch (err) {
    next(err);
  }
}

// Met à jour un produit existant.
async function update(req, res, next) {
  try {
    const { name, price, quantity } = req.body;
    await Product.update(req.params.id, {
      name: (name || '').trim(),
      price: Number(price) || 0,
      quantity: parseInt(quantity, 10) || 0,
    });
    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

// Supprime un produit.
async function remove(req, res, next) {
  try {
    await Product.remove(req.params.id);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

module.exports = { index, newForm, create, editForm, update, remove };
