const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const envDir = path.resolve(__dirname, 'src/environments');
if (!fs.existsSync(envDir)) fs.mkdirSync(envDir, { recursive: true });

// Charger séparément
const envDev = dotenv.config({ path: '.env' }).parsed;
const envProd = dotenv.config({ path: '.env.prod' }).parsed;

function generateEnvFile(envVars: any, outputPath: string, isProd = false): void {
  const fileContent = `export const environment = {
  production: ${isProd},
  firebase: {
    apiKey: "${envVars['NG_APP_FIREBASE_API_KEY']}",
    authDomain: "${envVars['NG_APP_FIREBASE_AUTH_DOMAIN']}",
    projectId: "${envVars['NG_APP_FIREBASE_PROJECT_ID']}",
    storageBucket: "${envVars['NG_APP_FIREBASE_STORAGE_BUCKET']}",
    messagingSenderId: "${envVars['NG_APP_FIREBASE_APIKEY_MESSAGING_SENDER_ID']}",
    appId: "${envVars['NG_APP_FIREBASE_APP_ID']}",
    vapidKey: "${envVars['NG_APP_FIREBASE_VAPID_KEY']}"
  },
  openAiApiKey: "${envVars['NG_APP_OPENAI_KEY']}",
  luxandApiToken: "${envVars['NG_APP_LUXAND_API_TOKEN']}",
  notificationServerUrl: "${envVars['NG_APP_NOTIFICATION_SERVER_URL']}",
  notificationBaseUrl: "${envVars['NG_APP_NOTIFICATION_BASE_URL']}"
};
`;

  fs.writeFileSync(outputPath, fileContent);
}

// ➔ On passe envDev pour dev et envProd pour prod
generateEnvFile(envDev, path.join(envDir, 'environment.ts'), false);
generateEnvFile(envProd, path.join(envDir, 'environment.prod.ts'), true);

console.log('✅ environment.ts et environment.prod.ts générés proprement.');
