const OpenAI = require('openai');

let client;

function getClient() {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const error = new Error('OPENAI_API_KEY absent.');
      error.statusCode = 500;
      error.code = 'OPENAI_KEY_MISSING';
      throw error;
    }

    client = new OpenAI({ apiKey });
  }

  return client;
}

async function createChatCompletion(messages, options = {}) {
  const model = options.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const temperature = typeof options.temperature === 'number' ? options.temperature : 0.4;

  const completion = await getClient().chat.completions.create({
    model,
    temperature,
    messages,
  });

  return completion.choices?.[0]?.message?.content || '';
}

module.exports = {
  createChatCompletion,
};
