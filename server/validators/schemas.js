const { z } = require('zod');

const recommendationSchema = z.object({
  theme: z.enum(['sport', 'alimentation', 'soins']),
  diagnosticType: z.enum(['sport', 'alimentation', 'soins']).optional(),
  diagnostic: z.record(z.any()),
});

const chatSchema = z.object({
  message: z.string().trim().min(1).max(3000),
});

const emotionDetectSchema = z.object({
  imageBase64: z.string().trim().min(10),
  mimeType: z.enum(['image/png', 'image/jpeg', 'image/jpg']).default('image/png'),
});

const notificationSchema = z.object({
  theme: z.enum(['sport', 'alimentation', 'soins']),
  title: z.string().trim().min(1).max(120).optional(),
  body: z.string().trim().min(1).max(500).optional(),
});

module.exports = {
  recommendationSchema,
  chatSchema,
  emotionDetectSchema,
  notificationSchema,
};
