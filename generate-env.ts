const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const envDir = path.resolve(__dirname, 'src/environments');
if (!fs.existsSync(envDir)) fs.mkdirSync(envDir, { recursive: true });

type EnvMap = Record<string, string | undefined>;

// Charger séparément
const envDev = (dotenv.config({ path: '.env' }).parsed || {}) as EnvMap;
const envProd = (dotenv.config({ path: '.env.prod' }).parsed || {}) as EnvMap;

const requiredFrontendVars = [
  'NG_APP_FIREBASE_API_KEY',
  'NG_APP_FIREBASE_AUTH_DOMAIN',
  'NG_APP_FIREBASE_PROJECT_ID',
  'NG_APP_FIREBASE_STORAGE_BUCKET',
  'NG_APP_FIREBASE_APIKEY_MESSAGING_SENDER_ID',
  'NG_APP_FIREBASE_APP_ID',
];

function getMissingVars(envVars: EnvMap, keys: string[]): string[] {
  return keys.filter((key) => !String(envVars[key] || '').trim());
}

function assertRequiredVars(envVars: EnvMap, sourceName: string): void {
  const missing = getMissingVars(envVars, requiredFrontendVars);

  if (missing.length > 0) {
    console.error(`\n❌ Variables manquantes dans ${sourceName}:`);
    missing.forEach((item) => console.error(` - ${item}`));
    console.error('\nAjoute ces valeurs depuis Firebase Console > Parametres du projet > Config Web.\n');
    process.exit(1);
  }
}

function generateEnvFile(envVars: EnvMap, outputPath: string, isProd = false): void {
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
  backendUrl: "${envVars['NG_APP_BACKEND_URL']}"
};
`;

  fs.writeFileSync(outputPath, fileContent);
}

assertRequiredVars(envDev, '.env');
assertRequiredVars(envProd, '.env.prod');

// ➔ On passe envDev pour dev et envProd pour prod
generateEnvFile(envDev, path.join(envDir, 'environment.ts'), false);
generateEnvFile(envProd, path.join(envDir, 'environment.prod.ts'), true);

console.log('✅ environment.ts et environment.prod.ts générés proprement.');
