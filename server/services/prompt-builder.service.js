function buildRecommendationPrompt(theme, diagnostic) {
  const base = `Diagnostic utilisateur (${theme}) :\n${JSON.stringify(diagnostic, null, 2)}\n`;

  if (theme === 'sport') {
    return `${base}\nRetourne strictement un JSON valide avec la structure:\n{\n  \"theme\": \"sport\",\n  \"titre\": \"...\",\n  \"description\": \"...\",\n  \"routine\": {\n    \"jours\": [\n      {\n        \"jour\": \"Lundi\",\n        \"exercices\": [\n          { \"nom\": \"...\", \"repetitions\": \"...\", \"zoneCiblee\": \"...\", \"tempsEntrainement\": \"...\" }\n        ]\n      }\n    ]\n  }\n}`;
  }

  if (theme === 'alimentation') {
    return `${base}\nRetourne strictement un JSON valide avec la structure:\n{\n  \"theme\": \"alimentation\",\n  \"titre\": \"...\",\n  \"description\": \"...\",\n  \"imageUrl\": \"...\",\n  \"bienfaits\": \"...\",\n  \"jours\": [\n    {\n      \"jour\": \"Lundi\",\n      \"repas\": [\n        {\n          \"nom\": \"...\",\n          \"quantite\": \"...\",\n          \"ingredients\": [\"...\"],\n          \"instructions\": \"...\",\n          \"tempsPreparation\": \"...\"\n        }\n      ]\n    }\n  ]\n}`;
  }

  return `${base}\nRetourne strictement un JSON valide avec la structure:\n{\n  \"theme\": \"soins\",\n  \"titre\": \"...\",\n  \"description\": \"...\",\n  \"prestation\": {\n    \"nom\": \"...\",\n    \"duree\": \"...\",\n    \"bienfaits\": [\"...\"],\n    \"protocole\": \"...\",\n    \"appareillage\": \"...\",\n    \"nomTechnique\": \"...\",\n    \"nomCremes\": \"...\"\n  },\n  \"institutPropose\": \"...\",\n  \"adresseInstitut\": \"...\"\n}`;
}

function buildEmotionPrompt({ emotion, profile, lastDiagnostic, lastMessage }) {
  return `Tu es un assistant bien-etre.\nEmotion detectee: ${emotion}.\nProfil: ${JSON.stringify(profile)}\nDernier diagnostic: ${JSON.stringify(lastDiagnostic)}\nDernier message: ${lastMessage || 'Aucun'}\nReponds de facon bienveillante en 5 phrases maximum et termine par une question ouverte.`;
}

module.exports = {
  buildRecommendationPrompt,
  buildEmotionPrompt,
};
