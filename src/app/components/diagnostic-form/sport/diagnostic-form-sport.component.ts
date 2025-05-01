import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { OpenAiService } from '../../../core/services/openia.service';
import { Router, RouterLink } from '@angular/router';
import { Recommendation } from '../../../core/interfaces';
import { firstValueFrom } from 'rxjs';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCheckbox, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonLabel, IonProgressBar, IonRadio, IonRadioGroup, IonTextarea, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { Swiper } from 'swiper';

@Component({
  selector: 'app-diagnostic-form-sport',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCheckbox,
    IonContent,
    IonDatetime,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonProgressBar,
    IonRadio,
    IonRadioGroup,
    IonTextarea,
    IonTitle,
    IonToolbar,
    RouterLink
  ],
  templateUrl: './diagnostic-form-sport.component.html',
  styleUrls: ['./diagnostic-form-sport.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DiagnosticFormSportComponent implements OnInit {
  @ViewChild('swiper', { static: true }) swiperRef!: ElementRef; 
  form: FormGroup;
  userId: string | null = null;
  isLoading = false;

  objectifs = [
    'Perdre du poids',
    'Prendre du muscle',
    'Me tonifier',
    'Améliorer ma posture',
    'Me remettre en forme doucement',
    'Améliorer mes performances sportives',
    'Autre'
  ];

  zones = ['Abdominaux', 'Fessiers', 'Jambes', 'Bras', 'Dos', 'Corps entier'];

  sports = [
    'Musculation',
    'Fitness / HIIT',
    'Cardio (course, vélo, etc.)',
    'Exercices au poids du corps',
    'Yoga / Pilates',
    'Danse / Zumba',
    'Autre'
  ];

  niveaux = ['Débutant', 'Intermédiaire', 'Avancé'];

  frequences = ['1 fois', '2 à 3 fois', '4 à 5 fois', '6 à 7 fois'];

  durees = ['15 min', '30 min', '45 min', '1 heure ou plus'];

  equipements = [
    'Aucun (juste mon poids du corps)',
    'Haltères',
    'Élastiques',
    'Tapis de sol',
    'Banc de musculation',
    'Vélo / tapis de course',
    'Autres'
  ];

  currentSlide = 0;
  progress = 0;
  totalSlides = 11;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private openAiService: OpenAiService,
    private router: Router
  ) {
    addIcons({ arrowBackOutline });
    this.form = this.fb.group({
      poids: ['', Validators.required],
      taille: ['', Validators.required],
      imc: [''],
      objectifs: [[]],
      autresObjectifs: [''],
      zones: [[]],
      sports: [[]],
      autresSports: [''],
      niveau: ['', Validators.required],
      frequence: ['', Validators.required],
      duree: ['', Validators.required],
      restriction: ['non'],
      detailRestriction: [''],
      equipements: [[]],
      autresEquipements: [''],
      rappels: ['oui'],
      remarques: [''],
      rappelHoraire: [''] // Ajout du champ pour les rappels
    });
  }

  async ngOnInit() {
    const user = await firstValueFrom(this.authService.user$);
    if (user?.uid) {
      this.userId = user.uid;
      console.log(this.userId);
    }
  }
  
  onCheckboxChange(event: any, field: string) {
    const selected = this.form.get(field)?.value || [];
    if (event.target.checked) {
      selected.push(event.target.value);
    } else {
      const index = selected.indexOf(event.target.value);
      if (index > -1) selected.splice(index, 1);
    }
    this.form.get(field)?.setValue(selected);
  }

  async nextSlide() {
    const swiper = this.swiperRef.nativeElement.swiper as Swiper;
    if (swiper && swiper.slideNext) {
      await swiper.slideNext();
      this.currentSlide++;
      this.updateProgress();
    }
  }

  async prevSlide() {
    const swiper = this.swiperRef.nativeElement.swiper as Swiper;
    if (swiper && swiper.slidePrev) {
      await swiper.slidePrev();
      this.currentSlide--;
      this.updateProgress();
    }
  }

  updateProgress() {
    this.progress = (this.currentSlide + 1) / this.totalSlides;
  }

  get backgroundClass(): string {
    return `background-slide-${this.currentSlide + 1}`;
  }

  async onSubmit() {
    if (this.form.invalid || !this.userId) return;

    this.isLoading = true;
    const diagnosticData = this.form.value;

    try {
      await this.openAiService.saveDiagnostic(this.userId, diagnosticData);

      const recommendation: Recommendation = await this.openAiService.enrichirAvecDiagnostic(
        this.userId,
        diagnosticData,
        'sport'
      );

      await this.openAiService.saveRecommendation(this.userId, recommendation);

      const rappelHoraire = this.form.get('rappelHoraire')?.value;
      if (rappelHoraire) {
        this.planifierNotification(rappelHoraire, 'sport');
      }

      this.router.navigate(['app/recommendations/sport']);
    } catch (err) {
      console.error('Erreur lors de la génération de la recommandation sport :', err);
      alert("Erreur lors de l’analyse IA. Veuillez réessayer.");
    } finally {
      this.isLoading = false;
    }
  }

  private planifierNotification(horaire: string, type: string) {
    console.log(`Notification planifiée à ${horaire} pour ${type}`);
    // Implémentez ici la logique pour planifier une notification
  }
}
