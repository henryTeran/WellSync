import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OpenAiService } from '../../../core/services/openia.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Recommendation } from '../../../core/interfaces';
import { FACIAL_FORM, MASSAGE_FORM, CORPS_FORM, ESTHETIQUE_FORM } from './forms.constants';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCheckbox, IonContent, IonDatetime, IonHeader, IonItem, IonLabel, IonProgressBar, IonRadio, IonRadioGroup, IonSelect, IonSelectOption, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular/standalone';

const elementsUI =[
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonProgressBar,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonRadioGroup,
  IonRadio,
  IonCheckbox,
  IonDatetime,
  IonButton,
  IonSpinner
];
@Component({
  selector: 'app-diagnostic-form-soins',
  imports: [ReactiveFormsModule, ...elementsUI],
  templateUrl: './diagnostic-form-soins.component.html',
  styleUrl: './diagnostic-form-soins.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DiagnosticFormSoinsComponent implements OnInit {
  @ViewChild('swiper', { static: true }) swiperRef: any;
  form: FormGroup;
  currentStep = 0;
  steps: any[] = [];
  typeSoin: string = '';
  userId: string | null = null;
  isLoading = false;
  progress = 0; 
  totalSteps = 0; 

  constructor(
    private _fb: FormBuilder,
    private _openAiService: OpenAiService,
    private _authService: AuthService,
    private _router: Router
  ) {
    this.form = new FormGroup({
      typeSoin: new FormControl('', Validators.required),
      rappelHoraire: new FormControl('') // Ajout du champ pour les rappels
    });
  }

  async ngOnInit() {
    const user = await firstValueFrom(this._authService.user$);
    if (user?.uid) {
      this.userId = user.uid;
    }
  }
  onTypeSelected() {
    this.typeSoin = this.form.get('typeSoin')?.value;
    let selectedForm: any[];
    this.totalSteps = this.steps.length + 1;

    switch (this.typeSoin) {
      case 'Soin visage':
        selectedForm = FACIAL_FORM;
        break;
      case 'Massage':
        selectedForm = MASSAGE_FORM;
        break;
      case 'Soin corps':
        selectedForm = CORPS_FORM;
        break;
      case 'Onglerie':
        selectedForm = ESTHETIQUE_FORM;
        break;
      default:
        selectedForm = [];
    }

    this.steps = selectedForm;
    this.totalSteps = selectedForm.length;
    this.updateProgress();

    selectedForm.forEach(q => {
      this.form.addControl(
        q.controlName,
        new FormControl(q.type === 'checkbox' ? [] : '', q.type !== 'checkbox' ? Validators.required : [])
      );
    });
  }

  onCheckboxChange(event: any, controlName: string) {
    const control = this.form.get(controlName);
    if (!control) return;
    const currentValue = control.value || [];
    if (event.detail.checked) {
      control.setValue([...currentValue, event.detail.value]);
    } else {
      control.setValue(currentValue.filter((v: string) => v !== event.detail.value));
    }
  }

  async nextStep() {
    const swiperContainer = document.querySelector('swiper-container') as any;
    await swiperContainer.swiper.slideNext();
    this.currentStep++;
    this.updateProgress();
  }
  
  async prevStep() {
    const swiperContainer = document.querySelector('swiper-container') as any;
    await swiperContainer.swiper.slidePrev();
    this.currentStep--;
    this.updateProgress();
  }
  
  updateProgress() {
    this.progress = (this.currentStep + 1) / this.totalSteps;
  }

  async onSubmit() {
    for (const controlName of Object.keys(this.form.controls)) {
      const control = this.form.get(controlName);
      if (control && control.validator) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    }
  
    console.log('Invalid:', this.isStepIncomplete(), 'UserId:', this.userId);
    if (this.isStepIncomplete() || !this.userId) return;
    
    this.isLoading = true;
    const diagnosticData = this.form.value;
    console.log('diagnosticData:', diagnosticData, 'UserId:', this.userId);
    
    try {
      await this._openAiService.saveDiagnostic(this.userId, diagnosticData);
      const recommendation: Recommendation = await this._openAiService.enrichirAvecDiagnostic(
        this.userId,
        diagnosticData,
        'soins'
      );
      await this._openAiService.saveRecommendation(this.userId, recommendation);
      this._router.navigate(['app/recommendations/soins']);

      const rappelHoraire = this.form.get('rappelHoraire')?.value;
      if (rappelHoraire) {
        this.planifierNotification(rappelHoraire, 'soins');
      }
    } catch (err) {
      console.error('Erreur IA:', err);
      alert("Erreur IA. Veuillez réessayer.");
    } finally {
      this.isLoading = false;
    }
  }
  
  private planifierNotification(horaire: string, type: string) {
    console.log(`Notification planifiée à ${horaire} pour ${type}`);
    // Implémentez ici la logique pour planifier une notification
  }

  isStepIncomplete(): boolean {
    if (this.currentStep === 0) {
      return this.form.get('typeSoin')?.invalid || false;
    } else {
      const step = this.steps[this.currentStep - 1];
      const control = this.form.get(step.controlName);
      return control?.invalid || false;
    }
  }
  get backgroundClass(): string {
    return `background-slide-${this.currentStep + 1}`;
  }

}
