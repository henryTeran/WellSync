import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { register} from 'swiper/element-bundle'
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './core/services/notification.service';



register();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit{ 

  constructor(
    private _authservice: AuthService,
    private _notificationService: NotificationService){}

  ngOnInit(): void {
    this._authservice.user$.subscribe(async user => {
      if (!user) {
        await this._authservice.loginAnonyme();
      }
    });
    this._notificationService.requestPermission();
    this._notificationService.listen();
  }
}
