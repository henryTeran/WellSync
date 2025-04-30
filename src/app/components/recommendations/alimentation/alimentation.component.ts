import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OpenAiService } from '../../../core/services/openia.service';
import { AlimentationRecommendation } from '../../../core/interfaces';
import { firstValueFrom } from 'rxjs';
import { addIcons } from 'ionicons';
import { arrowBackOutline, nutritionOutline } from 'ionicons/icons';

const elementsUi = [
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonButton,
  IonIcon,
];

@Component({
  selector: 'app-alimentation',
  standalone: true,
  imports: [CommonModule, RouterModule, ...elementsUi],
  templateUrl: './alimentation.component.html',
  styleUrls: ['./alimentation.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AlimentationComponent {

  recommendation: AlimentationRecommendation | null = null;
  userId: string | null = null;
  isLoading = true;

  constructor(
    private router: Router, 
    private readonly _authService: AuthService,
    private readonly _openAiService: OpenAiService) {
      addIcons({arrowBackOutline, nutritionOutline});
    }

  async ngOnInit(): Promise<void> {
    const user = await firstValueFrom(this._authService.user$);
      if (user?.uid) {
        this.userId = user.uid;
        await this.loadRecommendation();
      }
    }

  async loadRecommendation() {
    try {
      const recommandation = await this._openAiService.getLastRecommendation<AlimentationRecommendation>(this.userId!, 'alimentation');
      this.recommendation = recommandation;
    } catch (e) {
      console.error('Erreur lors du chargement de la recommandation alimentation :', e);
    } finally {
      this.isLoading = false;
    }
  }

  goToPlanning() {
    this.router.navigate(['/app/recommendations/alimentation/planning'], {
      state: { recommendation: this.recommendation }
    });
  }
}
