import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, fitnessOutline } from 'ionicons/icons';
import { SoinsRecommendation } from '../../../../core/interfaces';

const elementsUI = [
  IonContent,
  IonHeader,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonTitle,
  IonButtons,
  IonButton,
  RouterLink
];

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [...elementsUI],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  recommendation!: SoinsRecommendation;

  constructor(private router: Router) {
    addIcons({ arrowBackOutline, fitnessOutline });
  }

  ngOnInit() {
    const navigation = history.state;
    this.recommendation = navigation.recommendation;
    console.log('Recommandation reçue :', this.recommendation);
  }
}
