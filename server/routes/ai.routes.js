const express = require('express');
const { recommendationSchema, chatSchema } = require('../validators/schemas');
const { validate } = require('../middlewares/validate.middleware');
const { generateRecommendation } = require('../services/recommendation.service');
const { createChatCompletion } = require('../services/openai.service');

const router = express.Router();

router.post('/recommendation', validate(recommendationSchema), async (req, res, next) => {
  try {
    const { theme, diagnostic } = req.validatedBody;
    const recommendation = await generateRecommendation(theme, diagnostic);

    return res.json({
      success: true,
      data: recommendation,
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/chat', validate(chatSchema), async (req, res, next) => {
  try {
    const { message } = req.validatedBody;

    const content = await createChatCompletion([
      { role: 'system', content: 'Assistant bien-etre WellSync. Reponse concise et utile.' },
      { role: 'user', content: message },
    ]);

    return res.json({
      success: true,
      data: { content },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = {
  aiRouter: router,
};
