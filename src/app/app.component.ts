import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { register} from 'swiper/element-bundle'
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';



register();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
}
