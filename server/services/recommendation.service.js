const { createChatCompletion } = require('./openai.service');
const { buildRecommendationPrompt } = require('./prompt-builder.service');

function parseStrictJson(content) {
  const cleaned = String(content || '')
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  return JSON.parse(cleaned);
}

async function generateRecommendation(theme, diagnostic) {
  const prompt = buildRecommendationPrompt(theme, diagnostic);
  const content = await createChatCompletion([
    { role: 'system', content: 'Tu dois retourner uniquement du JSON valide.' },
    { role: 'user', content: prompt },
  ]);

  try {
    return parseStrictJson(content);
  } catch (error) {
    const parseError = new Error('La reponse IA n\'est pas un JSON valide.');
    parseError.statusCode = 502;
    parseError.code = 'OPENAI_INVALID_JSON';
    throw parseError;
  }
}

module.exports = {
  generateRecommendation,
};
