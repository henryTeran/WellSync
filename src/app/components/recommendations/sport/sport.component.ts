import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../../../core/services/auth.service';
import { SportRecommendation } from '../../../core/interfaces';
import { OpenAiService } from '../../../core/services/openia.service';
import { firstValueFrom } from 'rxjs';
import { IonButton, IonContent, IonFooter, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, fitnessOutline } from 'ionicons/icons';

const elementsUI = [
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonFooter,
  IonButton
];

@Component({
  selector: 'app-sport',
  standalone: true,
  imports: [CommonModule, ...elementsUI, RouterLink],
  templateUrl: './sport.component.html',
  styleUrl: './sport.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SportComponent implements OnInit {
  userId: string | null = null;
  recommendation: SportRecommendation | null = null;
  isLoading = true;

  currentDayIndex = 0;
  timerStarted = false;
  timerDisplay = '00:00';
  intervalId: any = null;

  constructor(
    private firestore: Firestore,
    private _authService: AuthService,
    private _openAiService: OpenAiService,
    private router: Router
  ) {
    addIcons({arrowBackOutline, fitnessOutline});
  }
  async ngOnInit() {
    // Vérifie si une nouvelle reco a été transmise via le state (après un diagnostic)
    const navigation = this.router.getCurrentNavigation();
    const stateReco = navigation?.extras?.state?.['recommendation'];

    if (stateReco) {
      this.recommendation = stateReco;
      this.isLoading = false;
    } else {
      // Sinon, charge la dernière depuis Firebase
      const user = await firstValueFrom(this._authService.user$);
      if (user?.uid) {
        this.userId = user.uid;
        await this.loadRecommendation();
      }
    }
  }

  async aionViewWillEnter() {
    const user = await firstValueFrom(this._authService.user$);
    if (user?.uid) {
      this.userId = user.uid;
      await this.loadRecommendation();
    }
  }

  async loadRecommendation() {
    try {
      const recommandation = await this._openAiService.getLastRecommendation<SportRecommendation>(this.userId!, 'sport');
      this.recommendation = recommandation;
    } catch (e) {
      console.error('Erreur lors du chargement de la recommandation sport :', e);
    } finally {
      this.isLoading = false;
    }
  }

  startRoutine() {
    this.timerStarted = true;
    let totalSeconds = 0;
    this.intervalId = setInterval(() => {
      totalSeconds++;
      const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
      const seconds = (totalSeconds % 60).toString().padStart(2, '0');
      this.timerDisplay = `${minutes}:${seconds}`;
    }, 1000);
  }

  stopRoutine() {
    clearInterval(this.intervalId);
    this.timerStarted = false;
    this.timerDisplay = '00:00';
  }

  removeAccents(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  getVideoUrl(exName: string): string {
    if (!exName) return '';
    const sanitized = this.removeAccents(exName.toLowerCase().replace(/\s+/g, ''));
    return `assets/sport/${sanitized}.mp4`;
  }
}
