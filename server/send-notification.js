const express = require('express');
const https = require('https');
const { google } = require('googleapis');
const serviceAccount = require('./wellsync-a4123-firebase-adminsdk-fbsvc-18120e4005.json');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const projectId = 'wellsync-a4123';
const baseUrl = process.env.NG_APP_NOTIFICATION_BASE_URL || 'https://172.20.10.9:5000';

async function getAccessToken() {
  const jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    ['https://www.googleapis.com/auth/firebase.messaging']
  );
  await jwtClient.authorize();
  return jwtClient.credentials.access_token;
}

app.post('/send-notification', async (req, res) => {
  const { token, theme } = req.body;

  if (!token || !theme) {
    return res.status(400).send({ error: 'Token et thème sont requis.' });
  }

  try {
    const accessToken = await getAccessToken();
    const message = JSON.stringify({
      message: {
        token: token,
        data: {
          title: `WellSync te recommande un ${theme} 🌟`,
          body: `Découvrez nos conseils personnalisés pour ${theme}.`,
          icon: `${baseUrl}/assets/logo-wellsync.svg`,
          click_action: `${baseUrl}/app/dashboard`
        }
      }
    });

    const options = {
      hostname: 'fcm.googleapis.com',
      path: `/v1/projects/${projectId}/messages:send`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(message)
      }
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        res.status(response.statusCode).json({ response: JSON.parse(data) });
      });
    });

    request.on('error', (error) => {
      console.error('Erreur HTTPS lors de l\'envoi de la notification :', error);
      res.status(500).send({ error: 'Erreur lors de l\'envoi de la notification.' });
    });

    request.write(message);
    request.end();
  } catch (error) {
    console.error('Erreur serveur (génération AccessToken) :', error);
    res.status(500).send({ error: 'Erreur serveur lors de l\'envoi de la notification.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur de notification démarré sur http://localhost:${PORT}`);
});
