const healthService = require('../health/healthService');

async function getHealth(req, res) {
  try {
    const last = healthService.getLast();
    res.json({ status: last.ok ? 'ok' : 'unhealthy', ...last });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}

module.exports = { getHealth };
