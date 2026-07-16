async function detectEmotionWithLuxand({ imageBase64, mimeType }) {
  const token = process.env.LUXAND_API_TOKEN;

  if (!token) {
    const error = new Error('LUXAND_API_TOKEN absent.');
    error.statusCode = 500;
    error.code = 'LUXAND_TOKEN_MISSING';
    throw error;
  }

  const payload = new FormData();
  const blob = new Blob([Buffer.from(imageBase64, 'base64')], { type: mimeType || 'image/png' });
  payload.append('photo', blob, 'emotion-upload');

  const response = await fetch('https://api.luxand.cloud/photo/emotions', {
    method: 'POST',
    headers: {
      token,
    },
    body: payload,
  });

  if (!response.ok) {
    const text = await response.text();
    const error = new Error('Echec de detection emotion Luxand.');
    error.statusCode = 502;
    error.code = 'LUXAND_REQUEST_FAILED';
    error.details = text;
    throw error;
  }

  return response.json();
}

module.exports = {
  detectEmotionWithLuxand,
};
