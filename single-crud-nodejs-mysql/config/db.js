// Configuration et initialisation de la connexion MySQL.
//
// On utilise le paquet « mysql2 » (et non l'ancien « mysql ») : il supporte
// nativement le mode d'authentification par défaut de MySQL 8.0
// (caching_sha2_password). Aucune option spéciale n'est donc nécessaire.

const mysql = require('mysql2/promise');
require('dotenv').config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'inventory',
} = process.env;

let pool;

// Attend que le serveur MySQL soit prêt à accepter des connexions, puis
// crée la base de données si elle n'existe pas encore.
// Utile lorsque le conteneur de l'application démarre avant que MySQL ne
// soit complètement initialisé (cas fréquent avec Docker).
async function waitForDatabaseServer(retries = 30, delayMs = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const connection = await mysql.createConnection({
        host: DB_HOST,
        port: Number(DB_PORT),
        user: DB_USER,
        password: DB_PASSWORD,
        charset: 'utf8mb4',
      });

      await connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` ` +
        'CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
      );
      await connection.end();
      return;
    } catch (err) {
      console.log(
        `MySQL indisponible (tentative ${attempt}/${retries}) : ${err.code || err.message}`
      );
      if (attempt === retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

// Crée le pool de connexions et la table « products » si nécessaire.
async function initDatabase() {
  await waitForDatabaseServer();

  pool = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      quantity INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Quelques produits de démonstration, uniquement si la table est vide.
  const [rows] = await pool.query('SELECT COUNT(*) AS count FROM products');
  if (rows[0].count === 0) {
    await pool.query(
      'INSERT INTO products (name, price, quantity) VALUES ?',
      [[
        ['Clavier mécanique', 25000, 12],
        ['Souris optique', 8000, 30],
        ['Écran 24 pouces', 95000, 7],
      ]]
    );
  }

  console.log(`Base de données "${DB_NAME}" prête (table "products").`);
  return pool;
}

// Renvoie le pool déjà initialisé (utilisé par le modèle).
function getPool() {
  if (!pool) {
    throw new Error("Le pool MySQL n'est pas initialisé. Appelez initDatabase() au démarrage.");
  }
  return pool;
}

module.exports = { initDatabase, getPool };
