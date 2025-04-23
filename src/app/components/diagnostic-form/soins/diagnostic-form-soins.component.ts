import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OpenAiService } from '../../../core/services/openia.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Recommendation } from '../../../core/interfaces';
import { IonicModule } from '@ionic/angular';
import { FACIAL_FORM, MASSAGE_FORM, CORPS_FORM, ESTHETIQUE_FORM } from './forms.constants';

@Component({
  selector: 'app-diagnostic-form-soins',
  imports: [ReactiveFormsModule, IonicModule],
  templateUrl: './diagnostic-form-soins.component.html',
  styleUrl: './diagnostic-form-soins.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DiagnosticFormSoinsComponent {
  form: FormGroup;
  currentStep = 0;
  steps: any[] = [];
  typeSoin: string = '';
  userId: string | null = null;
  isLoading = false;

  constructor(
    private _fb: FormBuilder,
    private _openAiService: OpenAiService,
    private _authService: AuthService,
    private _router: Router
  ) {
    this.form = new FormGroup({
      typeSoin: new FormControl('', Validators.required)
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

  nextStep() {
    if (this.currentStep < this.steps.length) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 0) this.currentStep--;
  }

  async onSubmit() {
    if (this.form.invalid || !this.userId) return;
    this.isLoading = true;
    const diagnosticData = this.form.value;

    try {
      await this._openAiService.saveDiagnostic(this.userId, diagnosticData);

      const recommendation: Recommendation = await this._openAiService.enrichirAvecDiagnostic(
        this.userId,
        diagnosticData,
        'soins'
      );

      await this._openAiService.saveRecommendation(this.userId, recommendation);

      this._router.navigate(['/soins']);
    } catch (err) {
      console.error('Erreur lors de la recommandation soins :', err);
      alert("Erreur IA. Veuillez réessayer.");
    } finally {
      this.isLoading = false;
    }
  }


}
