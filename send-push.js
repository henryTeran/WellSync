// send-push.js (version sans axios)

const { google } = require('googleapis');
const https = require('https');

// Charger ton fichier de service Firebase
const serviceAccount = require('./wellsync-a4123-firebase-adminsdk-fbsvc-18120e4005.json');

// ID du projet Firebase
const projectId = 'wellsync-a4123';

// Ton token utilisateur cible
const fcmToken = 'dtpyF9N0naUy4EpP8BSfkG:APA91bGhEBh3CgoQ7tSGJm-qBPzoTxqGP_RVUw7RKMhjHYHbn1g6juP6trCIJ9WjdogMmflxTo79oqUH11hQzMpdJDzuFBw68HUJhcKlcRSn9x1XwWHlFNI';

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
