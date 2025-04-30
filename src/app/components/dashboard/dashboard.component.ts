import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OpenAiService } from '../../core/services/openia.service';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { AlimentationRecommendation, SportRecommendation, SoinsRecommendation } from '../../core/interfaces';
import { firstValueFrom, Observable, of, switchMap } from 'rxjs';

const elementsUI = [
  CommonModule,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonCard,
  IonButtons,
  IonIcon
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [...elementsUI, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardComponent {
  recommendationAlimentation$: Observable<AlimentationRecommendation | null>;
  recommendationSport$: Observable<SportRecommendation | null>;
  recommendationSoins$: Observable<SoinsRecommendation | null>;

  constructor(
    private _authService: AuthService,
    private _openAiService: OpenAiService,
    private _router: Router
  ) {
    addIcons({ arrowBackOutline });

    // Dynamique sans subscribe
    this.recommendationAlimentation$ = this._authService.user$.pipe(
      switchMap(user => user?.uid ? this._openAiService.getLastRecommendation<AlimentationRecommendation>(user.uid, 'alimentation') : of(null))
    );

    this.recommendationSport$ = this._authService.user$.pipe(
      switchMap(user => user?.uid ? this._openAiService.getLastRecommendation<SportRecommendation>(user.uid, 'sport') : of(null))
    );

    this.recommendationSoins$ = this._authService.user$.pipe(
      switchMap(user => user?.uid ? this._openAiService.getLastRecommendation<SoinsRecommendation>(user.uid, 'soins') : of(null))
    );
    console.log(firstValueFrom(this.recommendationSoins$))
  }

  naviguerVers(path: string): void {
    this._router.navigate([path]);
  }
}
