const { getFirebaseAdmin } = require('./firebase-admin.service');

function buildNotificationMessage(uid, token, body) {
  const title = body.title || `WellSync te recommande ${body.theme}`;
  const text = body.body || `Decouvre des conseils personnalises pour ${body.theme}.`;

  return {
    token,
    data: {
      title,
      body: text,
      click_action: '/app/dashboard',
      uid,
      theme: body.theme,
    },
    webpush: {
      fcmOptions: {
        link: '/app/dashboard',
      },
    },
  };
}

async function sendNotificationToCurrentUser(uid, body) {
  const admin = getFirebaseAdmin();
  const userDoc = await admin.firestore().collection('users').doc(uid).get();

  if (!userDoc.exists) {
    const error = new Error('Profil utilisateur introuvable.');
    error.statusCode = 404;
    error.code = 'USER_PROFILE_NOT_FOUND';
    throw error;
  }

  const token = userDoc.data()?.fcmToken;

  if (!token || typeof token !== 'string') {
    const error = new Error('Aucun token FCM enregistre pour cet utilisateur.');
    error.statusCode = 400;
    error.code = 'MISSING_FCM_TOKEN';
    throw error;
  }

  const message = buildNotificationMessage(uid, token, body);
  const responseId = await admin.messaging().send(message);
  return { messageId: responseId };
}

module.exports = {
  sendNotificationToCurrentUser,
};
