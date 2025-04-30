import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OpenAiService } from '../../../core/services/openia.service';
import { AuthService } from '../../../core/services/auth.service';
import { Recommendation } from '../../../core/interfaces';
import { firstValueFrom } from 'rxjs';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCheckbox, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonLabel, IonNote, IonProgressBar, IonRadio, IonRadioGroup, IonSelect, IonSelectOption, IonSpinner, IonTextarea, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { Swiper } from 'swiper';

const elementsUi = [
  IonInput,
  IonButton,
  IonLabel,
  IonItem,
  IonCheckbox,
  IonRadio,
  IonRadioGroup,
  IonTextarea,
  IonContent,
  IonDatetime,
  IonProgressBar,
  IonNote,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonSpinner
];

@Component({
  selector: 'app-diagnostic-form-alimentation',
  standalone: true,
  imports: [ReactiveFormsModule, ...elementsUi, FormsModule, RouterLink],
  templateUrl: './diagnostic-form-alimentation.component.html',
  styleUrls: ['./diagnostic-form-alimentation.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DiagnosticFormAlimentationComponent implements OnInit {
  @ViewChild('swiper', { static: true }) swiperRef!: ElementRef; 

  form: FormGroup;
  isLoading = false;
  userId: string | null = null;
  currentSlide = 0;
  progress = 0;
  totalSlides = 12; // 11 questions
  isTimePickerOpen = false;
  currentControlName: string = '';
  currentSelectedTime: string = '08:00';

  objectifs = [
    'Perdre du poids',
    'Prendre du muscle',
    'Avoir une alimentation plus équilibrée',
    'Avoir plus d’énergie / réduire la fatigue',
    'Suivre un régime spécifique (végétarien, keto, etc.)',
    'Réduire mes problèmes digestifs / ballonnements',
    'Autre'
  ];

  preferencesRecommandation = [
    'Un seul repas personnalisé',
    'Trois repas par jour (matin, midi, soir)',
    'Un plan alimentaire complet pour la semaine'
  ];

  regimes = [
    'Végétarien',
    'Végétalien',
    'Pescétarien',
    'Flexitarien',
    'Keto / Low carb',
    'Sans gluten',
    'Sans lactose',
    'Aucun en particulier',
    'Autre'
  ];

  tempsPreparation = [
    'Moins de 15 minutes',
    '15–30 minutes',
    '30–45 minutes',
    'Peu importe, j’aime cuisiner'
  ];

  nbRepasJour = ['1', '2', '3', '4 ou plus'];
  grignotages = ['Oui', 'Non', 'Parfois'];
  sexes = ['Homme', 'Femme', 'Autre / Préfère ne pas dire'];

  constructor(
    private fb: FormBuilder,
    private openAiService: OpenAiService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ arrowBackOutline });
    this.form = this.fb.group({
      poids: ['', Validators.required],
      taille: ['', Validators.required],
      age: ['', Validators.required],
      sexe: ['', Validators.required],
      objectifs: [[]],
      autresObjectifs: [''],
      preferenceRecommandation: ['', Validators.required],
      regimes: [[]],
      autresRegimes: [''],
      alimentsAEviter: [''],
      tempsPreparation: ['', Validators.required],
      nbRepasJour: ['', Validators.required],
      grignotage: ['', Validators.required],
      typeGrignotage: [''],
      horaires: this.fb.group({
        petitDejeuner: [''],
        dejeuner: [''],
        diner: ['']
      }),
      rappels: ['oui'],
      remarques: [''],
      rappelHoraire: [''] // Ajout du champ pour les rappels
    });
  }

  async ngOnInit() {
    const user = await firstValueFrom(this.authService.user$);
    if (user?.uid) {
      this.userId = user.uid;
    }
  }

  get horairesFormGroup(): FormGroup {
    return this.form.get('horaires') as FormGroup;
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

  async onSubmit() {
    if (this.form.invalid || !this.userId) return;

    this.isLoading = true;
    const diagnosticData = this.form.value;

    try {
      await this.openAiService.saveDiagnostic(this.userId, diagnosticData);

      const recommendation: Recommendation = await this.openAiService.enrichirAvecDiagnostic(
        this.userId,
        diagnosticData,
        'alimentation'
      );

      await this.openAiService.saveRecommendation(this.userId, recommendation);

      const rappelHoraire = this.form.get('rappelHoraire')?.value;
      if (rappelHoraire) {
        this.planifierNotification(rappelHoraire, 'alimentation');
      }

      setTimeout(() => {
        this.router.navigate(['app/recommendations/alimentation']);
      }, 2500); // 2.5 secondes
    } catch (err) {
      console.error('Erreur lors de la génération de la recommandation :', err);
      alert("Erreur lors de l’analyse IA. Veuillez réessayer.");
    } finally {
      this.isLoading = false;
    }
  }

  private planifierNotification(horaire: string, type: string) {
    console.log(`Notification planifiée à ${horaire} pour ${type}`);
    // Implémentez ici la logique pour planifier une notification
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
  
  smoothScrollToTop() {
    const content = document.querySelector('ion-content');
    if (content) {
      (content as any).scrollToTop(300); // 300ms de scroll smooth
    }
  }

  updateProgress() {
    this.progress = (this.currentSlide + 1) / this.totalSlides;
  }

  get backgroundClass(): string {
    return `background-slide-${this.currentSlide + 1}`;
  }

  toggleTimePicker(controlName: string) {
    if (this.isTimePickerOpen && this.currentControlName === controlName) {
      this.closeTimePicker();
    } else {
      this.currentControlName = controlName;
      const time = this.horairesFormGroup.get(controlName)?.value;
      this.currentSelectedTime = time && time.match(/^\d{2}:\d{2}$/) ? time : '08:00';
      this.isTimePickerOpen = true;
    }
  }

  setSelectedTime(event: any) {
    if (event && event.detail && event.detail.value) {
      this.currentSelectedTime = event.detail.value;
    }
  }

  closeTimePicker() {
    this.horairesFormGroup.get(this.currentControlName)?.setValue(this.currentSelectedTime);
    this.isTimePickerOpen = false;
  }

  onModalPresented() {
    console.log('Modal is fully presented.');
  }
}
