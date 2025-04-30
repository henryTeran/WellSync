import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, fitnessOutline } from 'ionicons/icons';
import { SoinsRecommendation } from '../../../../core/interfaces';

const elementsUI = [
  IonContent,
  IonHeader,
  IonToolbar,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
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
