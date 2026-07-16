const express = require('express');
const { validate } = require('../middlewares/validate.middleware');
const { emotionDetectSchema } = require('../validators/schemas');
const { detectEmotionWithLuxand } = require('../services/luxand.service');

const router = express.Router();

router.post('/detect', validate(emotionDetectSchema), async (req, res, next) => {
  try {
    const result = await detectEmotionWithLuxand(req.validatedBody);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = {
  emotionRouter: router,
};
