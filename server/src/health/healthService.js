const mongoose = require('mongoose');

let lastHealth = {
  ok: false,
  dbConnected: false,
  checkedAt: new Date().toISOString(),
  uptimeSeconds: process.uptime()
};

async function check() {
  let dbConnected = false;
  try {
    dbConnected = mongoose.connection.readyState === 1;
    if (dbConnected && mongoose.connection.db && mongoose.connection.db.admin) {
      // ping the server to be sure
      await mongoose.connection.db.admin().ping();
      dbConnected = true;
    }
  } catch (err) {
    dbConnected = false;
  }

  lastHealth = {
    ok: dbConnected,
    dbConnected,
    checkedAt: new Date().toISOString(),
    uptimeSeconds: process.uptime()
  };

  console.log(`[health] ${lastHealth.checkedAt} dbConnected=${dbConnected}`);
  return lastHealth;
}

function getLast() {
  return lastHealth;
}

module.exports = { check, getLast };
