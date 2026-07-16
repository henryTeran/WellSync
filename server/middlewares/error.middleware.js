function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'Endpoint introuvable.',
    code: 'NOT_FOUND',
  });
}

function errorHandler(error, req, res, next) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[API ERROR]', {
      path: req?.originalUrl,
      method: req?.method,
      message: error?.message,
      code: error?.code,
      statusCode: error?.statusCode,
      details: error?.details,
    });
  }

  if (error?.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Payload invalide.',
      code: 'VALIDATION_ERROR',
      details: error.issues,
    });
  }

  const statusCode = error?.statusCode || 500;
  const message = error?.message || 'Erreur serveur inattendue.';
  const code = error?.code || 'INTERNAL_SERVER_ERROR';

  const payload = {
    success: false,
    message,
    code,
  };

  if (process.env.NODE_ENV !== 'production' && error?.details) {
    payload.details = error.details;
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
