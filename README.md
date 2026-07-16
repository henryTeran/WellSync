# WellSync

WellSync est une application bien-etre construite avec Angular 19, Ionic et Firebase.

## Stack technique
- Angular 19 (standalone)
- Ionic
- Firebase Auth, Firestore, Hosting, FCM
- Backend Node.js/Express securise
- OpenAI (via backend)
- Luxand (via backend)
- Capacitor, PWA

## Installation
1. Installer les dependances:
   - `npm install`
2. Creer les variables d'environnement:
   - copier `.env.example` vers `.env`
   - copier `.env.example` vers `.env.prod` et adapter
3. Generer les environnements Angular:
   - `npm run generate-env`

## Variables d'environnement
Variables backend sensibles:
- OPENAI_API_KEY=
- OPENAI_MODEL=gpt-4o-mini
- LUXAND_API_TOKEN=
- FIREBASE_PROJECT_ID=
- FIREBASE_CLIENT_EMAIL=
- FIREBASE_PRIVATE_KEY=
- ALLOWED_ORIGINS=
- PORT=

Variables frontend (non sensibles):
- NG_APP_FIREBASE_API_KEY=
- NG_APP_FIREBASE_AUTH_DOMAIN=
- NG_APP_FIREBASE_PROJECT_ID=
- NG_APP_FIREBASE_STORAGE_BUCKET=
- NG_APP_FIREBASE_APIKEY_MESSAGING_SENDER_ID=
- NG_APP_FIREBASE_APP_ID=
- NG_APP_FIREBASE_VAPID_KEY=
- NG_APP_BACKEND_URL=

## Lancement frontend
- `npm start`

## Lancement backend
- `npm run server:dev`
- `npm run server:prod`

## Build production
- `npm run build`
- `npm run build:prod`

## Scripts utiles
- `npm run test`
- `npm run lint`
- `npm run compodoc`

## Fonctionnalites
- Authentification (email/password + anonyme)
- Conversion de compte anonyme vers compte classique
- Diagnostic sport/alimentation/soins
- Recommandations personnalisees
- Chat IA
- Detection emotionnelle
- Notifications FCM

## Securite
- Clefs IA uniquement cote backend
- Endpoints proteges par token Firebase
- CORS restreint
- Rate limiting actif
- Firestore rules durcies

Consulter aussi `SECURITY.md`.

## Limites actuelles
- Les custom claims admin doivent etre geres par un process backend/ops dedie.
- Les tests backend sont a etendre (integration/charge).
