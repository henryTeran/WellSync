import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../../../core/services/auth.service';
import { SportRecommendation } from '../../../core/interfaces';
import { OpenAiService } from '../../../core/services/openia.service';
import { firstValueFrom } from 'rxjs';
import { IonButton, IonContent, IonFooter, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar,  } from '@ionic/angular/standalone';

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
  imports: [CommonModule, ...elementsUI],
  templateUrl: './sport.component.html',
  styleUrl: './sport.component.css'
})
export class SportComponent implements OnInit {
  userId: string | null = null;
  recommendation: SportRecommendation | null = null;
  isLoading = true;

  // Carrousel & timer
  currentDayIndex: number = 0;
  currentExerciseIndex: number = 0;
  isRoutineStarted: boolean = false;
  isTimerRunning: boolean = false;
  remainingTime: number = 30; // 30 secondes par exercice par défaut
  timerInterval: any;

  timerStarted = false;
  timerDisplay = '00:00';
  intervalId: any = null;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
  };

  constructor(
    private firestore: Firestore,
    private _authService: AuthService,
    private _openAiService: OpenAiService
  ) {}

  async ngOnInit(): Promise<void> {
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

  commencerRoutine() {
    this.isRoutineStarted = true;
    this.currentDayIndex = 0;
    this.currentExerciseIndex = 0;
    this.startTimer();
  }

  startTimer() {
    this.isTimerRunning = true;
    this.remainingTime = 30;

    this.timerInterval = setInterval(() => {
      this.remainingTime--;

      if (this.remainingTime <= 0) {
        this.nextExercise();
      }
    }, 1000);
  }

  pauseTimer() {
    this.isTimerRunning = false;
    clearInterval(this.timerInterval);
  }

  nextExercise() {
    if (!this.recommendation) return;

    const currentDay = this.recommendation.routine.jours[this.currentDayIndex];

    if (this.currentExerciseIndex < currentDay.exercices.length - 1) {
      this.currentExerciseIndex++;
    } else {
      if (this.currentDayIndex < this.recommendation.routine.jours.length - 1) {
        this.currentDayIndex++;
        this.currentExerciseIndex = 0;
      } else {
        this.stopRoutine();
        return;
      }
    }

    this.remainingTime = 30;
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
    this.pauseTimer();
    this.isRoutineStarted = false;
    this.currentDayIndex = 0;
    this.currentExerciseIndex = 0;
  }

  get currentExercise() {
    if (!this.recommendation) return null;
    return this.recommendation.routine.jours[this.currentDayIndex].exercices[this.currentExerciseIndex];
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
