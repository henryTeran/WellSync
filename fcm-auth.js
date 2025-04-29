const { google } = require('googleapis');
const fs = require('fs');

// Charge ta clé privée (Service Account)
const serviceAccount = require('../WellSync/wellsync-a4123-firebase-adminsdk-fbsvc-18120e4005.json');

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
