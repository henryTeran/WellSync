const rateLimit = require('express-rate-limit');

const protectedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de requetes, veuillez reessayer plus tard.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

const notificationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de notifications envoyees. Patientez une minute.',
    code: 'NOTIFICATION_RATE_LIMIT_EXCEEDED',
  },
});

module.exports = {
  protectedLimiter,
  notificationLimiter,
};
