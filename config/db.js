//  конфигурации для подключения к MySQL.

const mysql = require('mysql2/promise');

let pool;
async function connectDB() {
  pool = await mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '*',
    database: 'telegram_service',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

function getDB() {
  if (!pool) {
    throw new Error('DB not connected');
  }
  return pool;
}

module.exports = { connectDB, getDB };
