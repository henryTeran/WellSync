const admin = require('firebase-admin');

function normalizePrivateKey(value) {
  return typeof value === 'string' ? value.replace(/\\n/g, '\n') : value;
}

function initFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  const isServiceAccountEmail = typeof clientEmail === 'string' && clientEmail.includes('gserviceaccount.com');

  if (projectId && clientEmail && privateKey && isServiceAccountEmail) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    return admin.app();
  }

  if (projectId) {
    // In dev, allow token verification with projectId even if service account env is incomplete/invalid.
    admin.initializeApp({ projectId });
    return admin.app();
  }

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });

  return admin.app();
}

function getFirebaseAdmin() {
  initFirebaseAdmin();
  return admin;
}

module.exports = {
  getFirebaseAdmin,
};
