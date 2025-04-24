import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-services',
  imports: [IonicModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ServicesComponent {
  constructor(private router: Router) {}

  naviguerVers(theme: string) {
    this.router.navigate(['app/diagnostic', theme]);
  }
}
