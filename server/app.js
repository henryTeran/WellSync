require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const { verifyFirebaseToken } = require('./middlewares/auth.middleware');
const { protectedLimiter } = require('./middlewares/rate-limit.middleware');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');
const { aiRouter } = require('./routes/ai.routes');
const { emotionRouter } = require('./routes/emotion.routes');
const { notificationRouter } = require('./routes/notification.routes');

function parseAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS || 'http://localhost:4200';
  return raw.split(',').map((item) => item.trim()).filter(Boolean);
}

function createApp() {
  const app = express();
  const allowedOrigins = parseAllowedOrigins();

  app.use(helmet());
  app.use(express.json({ limit: '5mb' }));
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origine non autorisee par CORS'));
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.get('/health', (req, res) => {
    res.json({ success: true, data: { status: 'ok' } });
  });

  app.use('/api', protectedLimiter);
  app.use('/api/ai', verifyFirebaseToken, aiRouter);
  app.use('/api/emotion', verifyFirebaseToken, emotionRouter);
  app.use('/api/notifications', verifyFirebaseToken, notificationRouter);

  app.use('/', verifyFirebaseToken, notificationRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp,
};
