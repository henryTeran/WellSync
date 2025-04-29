import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonInput, IonItem, IonLabel, IonText } from '@ionic/angular/standalone';

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
  IonButton
];
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, ...elementsUI],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        const user = await this.authService.login(email, password);
        if (user) {
          const role = await firstValueFrom(this.authService.role$);
            if (role === 'admin') {
              this.router.navigate(['app/admin']);
            } else {
              this.router.navigate([`app/dashboard/${user.uid}`]);
            }
          
        }
        this.errorMessage = null;
      } catch (error: any) {
        console.error("Erreur Firebase:", error.code, error.message);
        this.errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
      }
    }
  }
  
}
