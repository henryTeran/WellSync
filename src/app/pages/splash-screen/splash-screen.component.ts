import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-splash-screen',
  imports: [IonContent],
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})
export class SplashScreenComponent  implements OnInit {

  constructor(private _router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this._router.navigateByUrl('app/home');
    }, 5000); // Durée de 5 secondes
  }

}
