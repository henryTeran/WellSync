import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-splash-screen',
  imports: [IonicModule],
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SplashScreenComponent  implements OnInit {

  constructor(private _router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this._router.navigateByUrl('app/home');
    }, 5000); // Durée de 5 secondes
  }

}
