// --- fichier : src/app/services/notification.service.ts ---

import { Injectable } from '@angular/core';
import { getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _messaging: Messaging, private http: HttpClient) {}

  async requestPermission() {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      const token = await getToken(this._messaging, {
        vapidKey: environment.firebase.vapidKey
      });
      console.log('FCM Token :', token);
      return token;
    } else {
      console.error('Notification permission not granted.');
      return null;
    }
  }

  listen() {
    onMessage(this._messaging, (payload) => {
      console.log('New message received :', payload);
    });
  }

  envoyerNotificationParTheme(token: string, theme: string) {
    const baseUrl = environment.notificationBaseUrl || 'https://172.20.10.9:5000';

    const payload = {
      token: token,
      theme: theme,
      click_action: `${baseUrl}/app/dashboard`
    };

    return this.http.post(environment.notificationServerUrl + '/send-notification', payload).subscribe(
      res => console.log('Notification envoyée via serveur !', res),
      err => console.error('Erreur envoi serveur notification', err)
    );
  }
}
