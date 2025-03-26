const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Vérifie et crée le dossier si nécessaire
const envDir = path.resolve(__dirname, 'src/environments');
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

const fileContent = `export const environment = {
  production: false,
  firebase: {
    apiKey: "${process.env['NG_APP_FIREBASE_API_KEY']}",
    authDomain: "${process.env['NG_APP_FIREBASE_AUTH_DOMAIN']}",
    projectId: "${process.env['NG_APP_FIREBASE_PROJECT_ID']}",
    storageBucket: "${process.env['NG_APP_FIREBASE_STORAGE_BUCKET']}",
    messagingSenderId: "${process.env['NG_APP_FIREBASE_APIKEY_MESSAGING_SENDER_ID']}",
    appId: "${process.env['NG_APP_FIREBASE_APP_ID']}"
  },
  openAiApiKey: "${process.env['NG_APP_OPENAI_KEY']}"
};
`;

fs.writeFileSync(path.join(envDir, 'environment.ts'), fileContent);
console.log('✅ environment.ts généré à partir du fichier .env');
