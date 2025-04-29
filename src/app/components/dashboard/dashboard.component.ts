import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

import { firstValueFrom } from 'rxjs';
import { OpenAiService } from '../../core/services/openia.service';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';

const elementsUI =[
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonCard

]; 
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [...elementsUI],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  recommendationAlimentation: any = null;
  recommendationSport: any = null;
  recommendationSoins: any = null;

  constructor(
    private _authService: AuthService, 
    private _openAiService: OpenAiService,
    private _router: Router
  ) {}

  async ngOnInit() {
    const user = await firstValueFrom(this._authService.user$);
    if (!user) return;

    await this.loadRecommendations(user.uid);
  }

  async loadRecommendations(uid: string) {
    try {
      this.recommendationAlimentation = await this._openAiService.getLastRecommendation(uid, 'alimentation');
    } catch (e) {
      console.warn('Pas de recommandation alimentation trouvée.');
    }

    try {
      this.recommendationSport = await this._openAiService.getLastRecommendation(uid, 'sport');
    } catch (e) {
      console.warn('Pas de recommandation sport trouvée.');
    }

    try {
      this.recommendationSoins = await this._openAiService.getLastRecommendation(uid, 'soins');
    } catch (e) {
      console.warn('Pas de recommandation soins trouvée.');
    }
  }

  naviguerVers(path: string) {
    this._router.navigate(['/' + path]);
  }
}
