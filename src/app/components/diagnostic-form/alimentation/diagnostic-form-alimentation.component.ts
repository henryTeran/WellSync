import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OpenAiService } from '../../../core/services/openia.service';
import { AuthService } from '../../../core/services/auth.service';
import { Recommendation } from '../../../core/interfaces';

@Component({
  selector: 'app-diagnostic-form-alimentation',
  imports: [ReactiveFormsModule],
  templateUrl: './diagnostic-form-alimentation.component.html',
})
export class DiagnosticFormAlimentationComponent {
  form: FormGroup;
  isLoading = false;
  userId: string | null = null;

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
      remarques: ['']
    });

    this.authService.user$.subscribe(user => {
      this.userId = user?.uid || null;
    });
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

      this.router.navigate(['/alimentation']);
    } catch (err) {
      console.error('Erreur lors de la génération de la recommandation :', err);
      alert("Erreur lors de l’analyse IA. Veuillez réessayer.");
    } finally {
      this.isLoading = false;
    }
  }

}