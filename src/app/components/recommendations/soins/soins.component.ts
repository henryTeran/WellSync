import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { OpenAiService } from '../../../core/services/openia.service';
import { SoinsRecommendation } from '../../../core/interfaces';
import { firstValueFrom } from 'rxjs';
import { Browser } from "@capacitor/browser"
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, fitnessOutline } from 'ionicons/icons';

const elementsUI = [
  IonContent,
  IonHeader,
  IonToolbar,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonIcon,
  IonTitle,
  IonButtons,
  IonButton

];
@Component({
  selector: 'app-soins',
  imports: [...elementsUI, RouterLink],
  templateUrl: './soins.component.html',
  styleUrls: ['./soins.component.css']
})
export class SoinsComponent {
  recommendation: SoinsRecommendation | null = null;
  userId: string | null = null;
  isLoading = true;

  constructor(
    private _authService: AuthService,
    private _openAiService: OpenAiService,
    private router: Router
  ) {
    addIcons({arrowBackOutline, fitnessOutline});
  }

  async ionViewWillEnter(): Promise<void> {
  const user = await firstValueFrom(this._authService.user$);
    if (user?.uid) {
      this.userId = user.uid;
      await this.loadRecommendation(); 
    }
  }

  async loadRecommendation() {
    try {
      const recommandation = await this._openAiService.getLastRecommendation<SoinsRecommendation>(this.userId!, 'soins');
      this.recommendation = recommandation;
    } catch (e) {
      console.error('Erreur lors du chargement de la recommandation soins :', e);
    } finally {
      this.isLoading = false;
    }
  }

  async openMap(institut: string) {
    const query = encodeURIComponent(institut);
    await Browser.open({ url: `https://www.google.com/maps/search/?api=1&query=${query}` });
  }
  goTodetails() {
    this.router.navigate(['/app/recommendations/soins/details'], {
      state: { recommendation: this.recommendation }
    });
  
  }
}
