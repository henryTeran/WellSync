import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import {  } from '@ionic/angular';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

const elementsUi = [
  IonContent,
]; 

@Component({
  selector: 'app-home-page',
  imports: [...elementsUi, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageComponent {
  isLoading = false;

  constructor(
    public authService: AuthService, 
    private _router: Router) { }

  // async commencer() {
  //   this.isLoading = true;
  //   const user = await this._authService.loginAnonyme();
  //   if (user) {
  //     this._router.navigate([`app/dashboard/${user.uid}`]);
  //   } else {
  //     alert('Erreur de connexion. Réessaie.');
  //   }
  //   this.isLoading = false;
  // }



}
