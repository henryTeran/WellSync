import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText } from '@ionic/angular/standalone';

const elementsUI = [
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem, 
  IonLabel,
  IonInput,
  IonText,
  IonSelect, 
  IonSelectOption,
  IonButton,
  IonCardSubtitle
];
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, ...elementsUI], //  Ajout de ReactiveFormsModule
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required]
    });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const { email, password, role } = this.registerForm.value;
      try {
        const currentUser = this.authService.currentUser;
  
        if (currentUser && currentUser.isAnonymous) {
          //  Cas 1 : conversion depuis compte anonyme
          const convertedUser = await this.authService.convertirEnCompte(email, password, role);
          this.errorMessage = null;
          this.router.navigate([`/app/dashboard`]);
        } else {
          //  Cas 2 : inscription classique
          const newUser = await this.authService.register(email, password, role);
          this.errorMessage = null;
          this.router.navigate([`/app/dashboard`]);
        }
  
      } catch (error: any) {
        console.error("Erreur Firebase:", error.code, error.message);
        this.errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
      }
    }
  }
}
