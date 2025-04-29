import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';


const elementsUI = [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonCol,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonGrid,
    IonRow
];
@Component({
  selector: 'app-services',
  imports: [...elementsUI],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  constructor(private router: Router) {}

  naviguerVers(theme: string) {
    this.router.navigate(['app/diagnostic', theme]);
  }
}
