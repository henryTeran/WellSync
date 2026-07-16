// send-push.js — Script utilitaire local (non versionné en prod)
// Utilisez node server/index.js pour le serveur sécurisé.
// Ce script sert uniquement aux tests locaux.

const { google } = require('googleapis');
const https = require('https');

// Charger le fichier de service Firebase (variable d'environnement ou fichier local)
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './wellsync-a4123-firebase-adminsdk-fbsvc-18120e4005.json';
const serviceAccount = require(serviceAccountPath);

const projectId = serviceAccount.project_id;

// Token cible en variable d'environnement uniquement
const fcmToken = process.env.FCM_TEST_TOKEN;

if (!fcmToken) {
  console.error('FCM_TEST_TOKEN non défini. Positionner la variable d\'environnement.');
  process.exit(1);
}

// Fonction pour obtenir un token d'accès OAuth2
async function getAccessToken() {
  const jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    ['https://www.googleapis.com/auth/firebase.messaging'],
    null
  );

  await jwtClient.authorize();
  return jwtClient.credentials.access_token;
}

// Fonction pour envoyer la notification avec HTTPS
async function sendNotification() {
  const accessToken = await getAccessToken();

  const message = JSON.stringify({
    message: {
      token: fcmToken,
      data: {
        title: "WellSync te recommande un soin 💆‍♀️",
        body: "Détends-toi avec un massage bien-être !",
        icon: "assets/logo-wellsync.svg",
        click_action: "http://localhost:4200/app/dashboard"
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

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('Notification envoyée :', JSON.parse(data));
      } else {
        console.error('Erreur FCM :', res.statusCode, data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Erreur HTTPS :', error);
  });

  req.write(message);
  req.end();
}

// Lancer l'envoi
sendNotification();
