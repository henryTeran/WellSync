const express = require('express');
const { validate } = require('../middlewares/validate.middleware');
const { notificationSchema } = require('../validators/schemas');
const { notificationLimiter } = require('../middlewares/rate-limit.middleware');
const { sendNotificationToCurrentUser } = require('../services/fcm.service');

const router = express.Router();

async function sendNotificationHandler(req, res, next) {
  try {
    const uid = req.user?.uid;

    if (!uid) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifie.',
        code: 'AUTH_MISSING_UID',
      });
    }

    const result = await sendNotificationToCurrentUser(uid, req.validatedBody);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

router.post('/send', notificationLimiter, validate(notificationSchema), sendNotificationHandler);
router.post('/send-notification', notificationLimiter, validate(notificationSchema), sendNotificationHandler);

module.exports = {
  notificationRouter: router,
};
