import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent,  IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';


const elementsUI = [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,

    
];
@Component({
  selector: 'app-services',
  imports: [...elementsUI, RouterLink],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ServicesComponent {
  constructor(private router: Router) {
     addIcons({ arrowBackOutline });
  }

  naviguerVers(theme: string) {
    this.router.navigate(['app/diagnostic', theme]);
  }
}
