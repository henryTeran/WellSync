import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, fitnessOutline } from 'ionicons/icons';
import { SoinsRecommendation } from '../../../../core/interfaces';
import { OpenAiService } from '../../../../core/services/openia.service';
import { AuthService } from '../../../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

const elementsUI = [
  IonContent,
  IonHeader,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonTitle,
  IonButtons,
  IonButton,
  RouterLink,
];

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [...elementsUI, CommonModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  recommendation: SoinsRecommendation | null = null;

  constructor(
    private readonly router: Router,
    private readonly openAiService: OpenAiService,
    private readonly authService: AuthService,
  ) {
    addIcons({ arrowBackOutline, fitnessOutline });
  }

  async ngOnInit() {
    const stateRec = history.state?.recommendation as SoinsRecommendation | null;
    if (stateRec) {
      this.recommendation = stateRec;
    } else {
      const user = await firstValueFrom(this.authService.user$);
      if (user?.uid) {
        this.recommendation = await this.openAiService
          .getLastRecommendation<SoinsRecommendation>(user.uid, 'soins')
          .catch(() => null);
      }
    }
  }
}
