const { google } = require('googleapis');

// Charge ta clé privée depuis variable d'environnement ou fichier local
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './wellsync-a4123-firebase-adminsdk-fbsvc-18120e4005.json';
const serviceAccount = require(serviceAccountPath);

async function getAccessToken() {
  const jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    ['https://www.googleapis.com/auth/firebase.messaging'],
    null
  );

  await jwtClient.authorize();

  console.log('Access Token:');
  console.log(jwtClient.credentials.access_token);
}

getAccessToken();
