import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonRouterOutlet, ToastController } from '@ionic/angular/standalone';
import { register } from 'swiper/element-bundle';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './core/services/notification.service';
import { Router } from '@angular/router';

register();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit {
  private toastShown = false;

  constructor(
    private _authService: AuthService,
    private _notificationService: NotificationService,
    private _router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    // S’abonner aux changements utilisateur
    this._authService.user$.subscribe(async user => {
      if (!user) {
        // Aucun utilisateur → créer un compte anonyme
        await this._authService.loginAnonyme();
      } else if (user.isAnonymous && !this.toastShown) {
        // Utilisateur anonyme → informer
        this.toastShown = true;
        const toast = await this.toastCtrl.create({
          message: '🧪 Vous êtes actuellement en mode test. Certaines fonctionnalités peuvent être limitées.',
          duration: 6000,
          position: 'top',
          color: 'warning',
          buttons: [
            {
              text: 'Créer un compte',
              handler: () => {
                this._router.navigate(['/app/register']);
                return false;
              }
            }
          ]
        });
        await toast.present();
      }
    });

    // Notifications push
    this._notificationService.requestPermission();
    this._notificationService.listen();
  }
}
