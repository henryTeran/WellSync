import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

 
@Component({
  selector: 'app-home-page',
  imports: [IonicModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageComponent {
  isLoading = false;

  constructor(private _authService: AuthService, private _router: Router) {}

  async commencer() {
    this.isLoading = true;
    const user = await this._authService.loginAnonyme();
    if (user) {
      this._router.navigate(['/dashboard']);
    } else {
      alert('Erreur de connexion. Réessaie.');
    }
    this.isLoading = false;
  }

}
