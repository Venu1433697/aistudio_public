module.exports = function logger(req, res, next) {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const ms = diff[0] * 1e3 + diff[1] / 1e6;
    const time = new Date().toISOString();
    // Log: timestamp method path status duration-ms
    console.log(`${time} ${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(2)}ms`);
  });

  next();
};
