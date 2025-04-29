import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonChip, IonContent, IonIcon, IonLabel, IonSpinner, IonTabBar, IonTabButton, IonTabs, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { appsOutline, cameraOutline, chatbubbleEllipsesOutline, flaskOutline, homeOutline, logInOutline, logOutOutline } from 'ionicons/icons';

const elementsUi = [
  IonTabs,
  IonChip,
  IonIcon,
  IonLabel,
  IonTabButton,
  IonTabBar,
  IonContent,
  IonSpinner
];
@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, ...elementsUi],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent  implements OnInit {
  user$: Observable <User | null>; 

  constructor(
    private _authService: AuthService, 
    private _router: Router,
    private toastCtrl: ToastController) {
    addIcons({ chatbubbleEllipsesOutline, logInOutline, homeOutline, logOutOutline, appsOutline, cameraOutline, flaskOutline });
    this.user$ = _authService.user$; 
    console.log(firstValueFrom(this.user$))
   }

  ngOnInit() {
    this.user$.subscribe(async user => {
      if (user?.isAnonymous) {
        const toast = await this.toastCtrl.create({
          message: '🧪 Vous êtes actuellement en mode test. Certaines fonctionnalités peuvent être limitées.',
          duration: 6000,
          position: 'top',
          color: 'warning',
          buttons: [
            {
              text: 'Créer un compte',
              handler: () => {
                this.goToRegister();
                return false;
              }
            }
          ]
        });
        await toast.present();
      }
    });

  }
  async logout() {
    await this._authService.logout();
    this._router.navigate(['app/login']);
  }

  toastButtons = [
    {
      text: 'Créer un compte',
      handler: () => {
        this.goToRegister();
        return false;
      }
    }
  ];

  goToRegister() {
    this._router.navigate(['app/register']);
  }
}
