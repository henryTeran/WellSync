# WellSync 🩺

WellSync est une plateforme de gestion de santé moderne développée avec **Angular 19**, **Firebase** et **OpenAI**.

## 🚀 Fonctionnalités principales
- Authentification Firebase (user / admin)
- Chat IA (OpenAI)
- Dashboard patient et admin
- Système de rôles avec Guards
- Sauvegarde des conversations dans Firestore
- Fiches diagnostiques

## 📦 Stack Technique
- Angular 19 (Standalone components + Signals)
- Firebase Auth & Firestore
- OpenAI API (GPT-4o)
- RxJS, TypeScript strict

## 🔧 Lancer le projet
```bash
npm install
npm start
```
Puis ouvrir [http://localhost:4200]

## 📁 Structure recommandée
```
src/
├── app/
│   ├── core/            # Services, Guards, Interfaces
│   ├── components/      # UI Components (chatbot, login...)
│   ├── pages/           # Pages (dashboard, home...)
│   └── app.routes.ts    # Routes principales
```

## ✅ Scripts utiles
```bash

npm run test         # Lancer les tests unitaires
```

---

## 🛡️ Sécurité
- ⚠️ Vérifiez régulièrement l'onglet Security sur GitHub
- Mettez à jour vos dépendances avec `npm audit fix`

---

## 🧑‍💻 Auteur
Henry Teran – [GitHub](https://github.com/henryTeran)
