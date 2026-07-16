# SECURITY - WellSync

## Principes appliques
- Aucune cle OpenAI ou Luxand cote frontend.
- Toutes les clefs sensibles sont lues via variables d'environnement backend.
- Les endpoints sensibles sont proteges par Firebase ID Token (Bearer).
- CORS est limite a la liste ALLOWED_ORIGINS.
- Rate limiting actif sur routes API et notifications.

## Variables d'environnement
Configurer les variables suivantes dans `.env` (local) et en secret manager (prod):
- OPENAI_API_KEY
- LUXAND_API_TOKEN
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY
- ALLOWED_ORIGINS
- PORT

## Rotation des secrets
- Rotater OpenAI et Luxand regulierement.
- Ne jamais commiter de `.env`, service account JSON, token FCM ou fichier `.pem` prive.
- Revoquer immediatement toute cle exposee.

## Firebase Security Rules
- Les utilisateurs ne lisent/editaient que leurs propres donnees.
- Le champ role utilisateur ne peut pas etre modifie par l'utilisateur lui-meme.
- L'acces admin repose sur custom claims (`request.auth.token.admin == true`).

## Endpoints proteges
- POST /api/ai/recommendation
- POST /api/ai/chat
- POST /api/emotion/detect
- POST /api/notifications/send
- POST /send-notification (compatibilite)

Tous exigent `Authorization: Bearer <Firebase ID Token>`.

## Donnees emotionnelles
- Stockage minimal des resultats emotionnels.
- Eviter le stockage d'images faciales brutes.
- Conserver uniquement emotion, confiance, provider, metadonnees minimales.
