import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import {  } from '@ionic/angular';
import { IonButton, IonContent } from '@ionic/angular/standalone';

const elementsUi = [
  IonContent,
  IonButton
]; 

@Component({
  selector: 'app-home-page',
  imports: [...elementsUi],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageComponent {
  isLoading = false;

  constructor(private _authService: AuthService, private _router: Router) { }

  async commencer() {
    this.isLoading = true;
    const user = await this._authService.loginAnonyme();
    if (user) {
      this._router.navigate([`app/dashboard/${user.uid}`]);
    } else {
      alert('Erreur de connexion. Réessaie.');
    }
    this.isLoading = false;
  }

}
