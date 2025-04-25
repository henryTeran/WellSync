import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { register} from 'swiper/element-bundle'
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from './core/services/auth.service';



register();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{ 

  constructor(private _authservice: AuthService){}

  ngOnInit(): void {
    this._authservice.user$.subscribe(async user => {
      if (!user) {
        await this._authservice.loginAnonyme();
      }
    });
  }
}
