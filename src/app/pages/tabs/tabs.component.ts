import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { appsOutline, cameraOutline, chatbubbleEllipsesOutline, flaskOutline, homeOutline, logInOutline, logOutOutline } from 'ionicons/icons';

const elementsUi = [
  IonTabs,
  IonIcon,
  IonLabel,
  IonTabButton,
  IonTabBar
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
    private _router: Router) {
    addIcons({ chatbubbleEllipsesOutline, logInOutline, homeOutline, logOutOutline, appsOutline, cameraOutline, flaskOutline });
    this.user$ = _authService.user$; 
    console.log(firstValueFrom(this.user$))
   }

   ngOnInit() {

  }
  
  async logout() {
    await this._authService.logout();
    await this._authService.loginAnonyme();
    this._router.navigate(['/']);
  }



}
