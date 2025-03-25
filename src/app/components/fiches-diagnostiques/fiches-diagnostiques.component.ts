import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fiches-diagnostiques',
  imports: [],
  templateUrl: './fiches-diagnostiques.component.html',
  styleUrl: './fiches-diagnostiques.component.css'
})
export class FichesDiagnostiquesComponent {
  fichaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.fichaForm = this.fb.group({
      nombres: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(10), Validators.max(100)]],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],

      alergias: [''],
      enfermedades: [''],
      operaciones: [''],
      tratamientos: [''],
      lentesContacto: [''],
      protesis: [''],
      pacemakers: [''],
      dentales: [''],
      otrasProtesis: [''],
      tipoPiel: [''],

      tonoPiel: [''],
      texturaPiel: [''],
      imperfecciones: [''],
      sensibilidad: [''],
      divers: [""]     
    });
  }

  onSubmit() {
    if (this.fichaForm.valid) {
      console.log('Données du formulaire:', this.fichaForm.value);
      alert('Fiche soumise avec succès !');
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
  }

}
