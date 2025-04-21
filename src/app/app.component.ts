import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { combineLatest, firstValueFrom, map, Observable } from 'rxjs';
import { register} from 'swiper/element-bundle'
import { IonApp, IonRouterLink, IonRouterOutlet } from '@ionic/angular/standalone';



register();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, ChatbotComponent, IonApp, IonRouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isAdmin$: Observable<any>;
  shouldShowChatbot$: Observable<any>; 

  constructor(
    private _authService: AuthService, 
    private _router: Router) {

    this.isAdmin$ = this._authService.isAdmin();
    this.shouldShowChatbot$ = combineLatest([
      this._authService.isAdmin(),
      this._authService.isAuthenticated()
    ]).pipe(
      map(([isAdmin, isLoggedIn]) => isLoggedIn && !isAdmin)
    );

  }
  
  async ngOnInit(): Promise<void> {
    const user = await firstValueFrom(this._authService.user$); 
    if (user) {
      this.isLoggedIn = !!user; 
    }

  }

  async logout() {
    await this._authService.logout();
    this._router.navigate(['/login']);
  }
}
