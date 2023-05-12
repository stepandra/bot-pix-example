// src/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.join(__dirname, '..', 'database.sqlite');

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// db.serialize(() => {
//   db.run(`
//     CREATE TABLE IF NOT EXISTS providers (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       telegram_id INTEGER NOT NULL,
//       polygon_address TEXT NOT NULL
//     );
//   `, (err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log('Created providers table.');
//   });
// });

// src/database.js
// ...

db.serialize(() => {
    // ...
    db.run(`
      CREATE TABLE IF NOT EXISTS providers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        telegram_id INTEGER NOT NULL,
        polygon_address TEXT NOT NULL,
        accepted_order INTEGER
      );
    `);
  
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pix_address TEXT NOT NULL,
        amount REAL NOT NULL,
        usdt_amount REAL NOT NULL,
        provider_id INTEGER,
        receipt_image TEXT
      );
    `);
  });
  
  // ...
  
// src/database.js
// ...

function saveProvider(telegramId, polygonAddress) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO providers (telegram_id, polygon_address) VALUES (?, ?)';
      db.run(query, [telegramId, polygonAddress], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }
  
  function getProviders() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM providers';
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  
  function updateProvider(telegramId, polygonAddress) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE providers SET polygon_address = ? WHERE telegram_id = ?';
      db.run(query, [polygonAddress, telegramId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }
  
  function saveOrder(pixAddress, amount, usdtAmount) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO orders (pix_address, amount, usdt_amount) VALUES (?, ?, ?)';
      db.run(query, [pixAddress, amount, usdtAmount], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }
  
  function getOrderById(orderId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM orders WHERE id = ?';
      db.get(query, [orderId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
  
  function updateOrder(orderId, providerId, receiptImage) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE orders SET provider_id = ?, receipt_image = ? WHERE id = ?';
      db.run(query, [providerId, receiptImage, orderId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }


  module.exports = {
    saveProvider,
    getProviders,
    updateProvider,
    db,
    saveOrder,
    getOrderById,
    updateOrder,
  };
  

// module.exports = db;
