// firebase-messaging-sw.js

// Import Firebase scripts pour le service worker
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

// Initialise Firebase app dans le service worker
firebase.initializeApp({
  apiKey: "AIzaSyChVYCzUpatehRW1N7X6--M8EG7FPyZ140",
  authDomain: "wellsync-a4123.firebaseapp.com",
  projectId: "wellsync-a4123",
  storageBucket: "wellsync-a4123.appspot.com",  
  messagingSenderId: "630604447724",
  appId: "1:630604447724:web:ac54b79f87be1345690ac9"
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
      click_action: payload.data.click_action || 'https://172.20.10.9:5000/app/dashboard'
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
