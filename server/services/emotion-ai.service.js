const { createChatCompletion } = require('./openai.service');
const { buildEmotionPrompt } = require('./prompt-builder.service');

async function generateEmotionResponse(payload) {
  const prompt = buildEmotionPrompt(payload);

  return createChatCompletion([
    {
      role: 'system',
      content: 'Tu es un coach bien-etre empathique. Reponse concise et actionable.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ]);
}

module.exports = {
  generateEmotionResponse,
};
