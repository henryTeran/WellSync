import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { OpenAiService } from '../../../core/services/openia.service';
import { Router } from '@angular/router';
import { Recommendation } from '../../../core/interfaces';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-diagnostic-form-sport',
  imports: [ReactiveFormsModule],
  templateUrl: './diagnostic-form-sport.component.html',
})
export class DiagnosticFormSportComponent implements OnInit {
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private openAiService: OpenAiService,
    private router: Router
  ) {
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
      remarques: ['']
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

      this.router.navigate(['/sport']);
    } catch (err) {
      console.error('Erreur lors de la génération de la recommandation sport :', err);
      alert("Erreur lors de l’analyse IA. Veuillez réessayer.");
    } finally {
      this.isLoading = false;
    }
  }
}
