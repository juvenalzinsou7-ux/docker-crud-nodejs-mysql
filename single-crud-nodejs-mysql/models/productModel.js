// Modèle « Product » : toutes les requêtes SQL liées aux produits.
// On utilise des requêtes préparées (?) pour éviter les injections SQL.

const { getPool } = require('../config/db');

async function getAll() {
  const [rows] = await getPool().query('SELECT * FROM products ORDER BY id DESC');
  return rows;
}

async function getById(id) {
  const [rows] = await getPool().query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
}

async function create({ name, price, quantity }) {
  const [result] = await getPool().query(
    'INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)',
    [name, price, quantity]
  );
  return result.insertId;
}

async function update(id, { name, price, quantity }) {
  await getPool().query(
    'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?',
    [name, price, quantity, id]
  );
}

async function remove(id) {
  await getPool().query('DELETE FROM products WHERE id = ?', [id]);
}

module.exports = { getAll, getById, create, update, remove };
