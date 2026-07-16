// src/app/core/services/notification.service.ts

import { Injectable } from '@angular/core';
import { getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { doc, setDoc } from 'firebase/firestore';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsEnabled = false;

  constructor(
    private readonly messaging: Messaging,
    private readonly http: HttpClient,
    private readonly firestore: Firestore,
    private readonly auth: Auth,
  ) {}

  async enableNotificationsForUser(): Promise<string | null> {
    const user = this.auth.currentUser;

    if (!user) {
      return null;
    }

    if (this.notificationsEnabled) {
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      return null;
    }

    const token = await getToken(this.messaging, {
      vapidKey: environment.firebase.vapidKey,
    });

    if (token) {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userRef, { fcmToken: token, updatedAt: new Date() }, { merge: true });
      this.notificationsEnabled = true;
    }

    return token || null;
  }

  listen(): void {
    onMessage(this.messaging, (payload) => {
      const title = payload.data?.['title'] || payload.notification?.title || 'WellSync';
      const body = payload.data?.['body'] || payload.notification?.body || '';
      console.info(`[FCM] ${title}: ${body}`);
    });
  }

  async envoyerNotificationParTheme(theme: 'sport' | 'alimentation' | 'soins'): Promise<void> {
    const user = this.auth.currentUser;

    if (!user) {
      throw new Error('Utilisateur non connecté.');
    }

    const idToken = await user.getIdToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    });

    await firstValueFrom(
      this.http.post(
        `${environment.backendUrl}/api/notifications/send`,
        { theme },
        { headers },
      ),
    );
  }
}
