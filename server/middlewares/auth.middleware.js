const { getFirebaseAdmin } = require('../services/firebase-admin.service');

async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token Firebase manquant.',
      code: 'AUTH_MISSING_TOKEN',
    });
  }

  const idToken = authHeader.slice('Bearer '.length).trim();

  if (!idToken) {
    return res.status(401).json({
      success: false,
      message: 'Token Firebase invalide.',
      code: 'AUTH_INVALID_TOKEN',
    });
  }

  try {
    const admin = getFirebaseAdmin();
    const checkRevoked = process.env.FIREBASE_VERIFY_REVOKED === 'true';

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken, checkRevoked);
    } catch (error) {
      const canFallbackWithoutRevocationCheck = checkRevoked && process.env.NODE_ENV !== 'production';

      if (!canFallbackWithoutRevocationCheck) {
        throw error;
      }

      // En local, certaines configurations n'ont pas les credentials IAM pour checkRevoked=true.
      decodedToken = await admin.auth().verifyIdToken(idToken, false);
    }

    req.user = decodedToken;
    return next();
  } catch (error) {
    console.error('[Auth] Firebase token verification failed:', error?.code || error?.message || error);

    const response = {
      success: false,
      message: 'Authentification Firebase invalide.',
      code: 'AUTH_INVALID_TOKEN',
    };

    if (process.env.NODE_ENV !== 'production') {
      response.details = String(error?.code || error?.message || 'unknown_error');
    }

    return res.status(401).json(response);
  }
}

module.exports = {
  verifyFirebaseToken,
};
