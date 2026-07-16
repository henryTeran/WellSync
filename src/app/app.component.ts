import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { register } from 'swiper/element-bundle';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './core/services/notification.service';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

register();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly firestore: Firestore,
  ) {}

  ngOnInit(): void {
    this.notificationService.listen();

    this.authService.user$.subscribe(async (user) => {
      if (!user) {
        await this.authService.loginAnonyme();
        return;
      }

      if (user.isAnonymous) {
        const docSnapshot = await getDoc(doc(this.firestore, `users/${user.uid}`));
        if (!docSnapshot.exists()) {
          await setDoc(doc(this.firestore, `users/${user.uid}`), {
            uid: user.uid,
            anonymous: true,
            role: 'user',
            createdAt: new Date(),
          });
        }
      }
    });
  }
}