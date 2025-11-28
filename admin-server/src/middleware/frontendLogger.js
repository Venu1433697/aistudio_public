module.exports = function frontendLogger(req, res, next) {
  // Log the API request immediately in the requested format
  console.log(`[INFO] 📩 API Request: ${req.method} ${req.originalUrl}`);

  // After response finishes, if auth populated a user/admin, log the id
  res.on('finish', () => {
    try {
      if (req.admin && req.admin.id) {
        console.log(`userId new ObjectId('${req.admin.id}')`);
      } else if (req.user && req.user.id) {
        console.log(`userId new ObjectId('${req.user.id}')`);
      }
    } catch (e) {
      // ignore logging errors
    }
  });

  next();
};
