// firebase-messaging-sw.js
// Les clés sensibles Firebase (apiKey, appId…) restent utilisées côté client pour FCM
// Ces valeurs ne donnent pas accès aux données — la sécurité s'appuie sur les règles Firestore et l'auth Firebase.

importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "REPLACED_AT_BUILD_TIME",
  authDomain: "REPLACED_AT_BUILD_TIME",
  projectId: "REPLACED_AT_BUILD_TIME",
  storageBucket: "REPLACED_AT_BUILD_TIME",
  messagingSenderId: "REPLACED_AT_BUILD_TIME",
  appId: "REPLACED_AT_BUILD_TIME"
});

// Récupère Firebase Messaging
const messaging = firebase.messaging();

// Réception des messages en background (basés sur `data`)
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Message data reçu en background:', payload);

  const notificationTitle = payload.data.title || 'WellSync Notification';
  const notificationOptions = {
    body: payload.data.body || 'Vous avez un nouveau message WellSync.',
    icon: payload.data.icon || '/assets/logo-wellsync.svg',
    badge: '/assets/logo-wellsync.svg',
    vibrate: [200, 100, 200],
    data: {
      click_action: payload.data.click_action || 'https://wellsync-a4123.web.app/app/dashboard'
    },
    actions: [
      {
        action: 'open_dashboard',
        title: 'Ouvrir Dashboard 🏥'
      },
      {
        action: 'dismiss',
        title: 'Ignorer'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gérer les clics sur les notifications
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click:', event.notification);

  event.notification.close();

  if (event.action === 'open_dashboard') {
    event.waitUntil(
      clients.openWindow(event.notification.data.click_action)
    );
  } else if (event.action === 'dismiss') {
    // Ne rien faire si "Ignorer"
    console.log('[Service Worker] Notification ignorée');
  } else {
    // Clic normal sur la notification (pas un bouton spécifique)
    event.waitUntil(
      clients.openWindow(event.notification.data.click_action)
    );
  }
});
