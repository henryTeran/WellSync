import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonRouterOutlet, ToastController } from '@ionic/angular/standalone';
import { register } from 'swiper/element-bundle';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './core/services/notification.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

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
    private toastCtrl: ToastController,
    private _firestore: Firestore
  ) {}

  ngOnInit(): void {
    this._authService.user$.pipe(take(1)).subscribe(async user => {
      if (!user) {
        // Si aucun utilisateur (fail du guard ?), on crée un compte anonyme ici
        console.log("Aucun utilisateur → création anonyme manuelle");
        user = await this._authService.loginAnonyme();
      }
  
      if (user?.isAnonymous) {
        console.log("Utilisateur anonyme détecté");
  
        // Vérifie si le document Firestore existe
        const docSnapshot = await getDoc(doc(this._firestore, `users/${user.uid}`));
        if (!docSnapshot.exists()) {
          // Si pas encore enregistré → crée le document Firestore
          await setDoc(doc(this._firestore, `users/${user.uid}`), {
            uid: user.uid,
            anonymous: true,
            role: 'user',
            createdAt: new Date()
          });
          console.log("Utilisateur anonyme enregistré dans Firestore");
        }
  
        // Demande le token pour notification (optionnel si déjà stocké)
        await this._notificationService.requestPermission(user.uid);
  
        // Affiche un toast pour informer le mode test
        if (!this.toastShown) {
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
      } else if (user && !user.isAnonymous) {
        await this._notificationService.requestPermission(user.uid);
      }
    });
  
    this._notificationService.listen();
  }
  

}