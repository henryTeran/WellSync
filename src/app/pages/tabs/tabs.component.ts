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
  private toastShown = false;

  constructor(
    private _authService: AuthService, 
    private _router: Router,
    private toastCtrl: ToastController) {
    addIcons({ chatbubbleEllipsesOutline, logInOutline, homeOutline, logOutOutline, appsOutline, cameraOutline, flaskOutline });
    this.user$ = _authService.user$; 
    console.log(firstValueFrom(this.user$))
   }

   ngOnInit() {

  }
  
  async logout() {
    await this._authService.logout();
    await this._authService.loginAnonyme();
    this._router.navigate(['app/home']);
  }



}
