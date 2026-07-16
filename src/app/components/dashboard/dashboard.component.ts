import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OpenAiService } from '../../core/services/openia.service';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { AlimentationRecommendation, SportRecommendation, SoinsRecommendation } from '../../core/interfaces';
import { Observable, of, switchMap, catchError } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

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
  IonIcon,
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [...elementsUI, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardComponent {
  recommendationAlimentation$: Observable<AlimentationRecommendation | null>;
  recommendationSport$: Observable<SportRecommendation | null>;
  recommendationSoins$: Observable<SoinsRecommendation | null>;

  constructor(
    private readonly authService: AuthService,
    private readonly openAiService: OpenAiService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {
    addIcons({ arrowBackOutline });

    this.recommendationAlimentation$ = this.authService.user$.pipe(
      switchMap((user) =>
        user?.uid
          ? this.openAiService.getLastRecommendation<AlimentationRecommendation>(user.uid, 'alimentation').catch(() => null)
          : of(null),
      ),
      catchError(() => of(null)),
    );

    this.recommendationSport$ = this.authService.user$.pipe(
      switchMap((user) =>
        user?.uid
          ? this.openAiService.getLastRecommendation<SportRecommendation>(user.uid, 'sport').catch(() => null)
          : of(null),
      ),
      catchError(() => of(null)),
    );

    this.recommendationSoins$ = this.authService.user$.pipe(
      switchMap((user) =>
        user?.uid
          ? this.openAiService.getLastRecommendation<SoinsRecommendation>(user.uid, 'soins').catch(() => null)
          : of(null),
      ),
      catchError(() => of(null)),
    );
  }

  naviguerVers(path: string): void {
    this.router.navigate([path]);
  }

  async activerRappels(): Promise<void> {
    try {
      await this.notificationService.enableNotificationsForUser();
    } catch (error) {
      this.errorHandlerService.logDevError('DashboardComponent.activerRappels', error);
      await this.errorHandlerService.showUserError('Impossible d\'activer les notifications pour le moment.');
    }
  }
}
