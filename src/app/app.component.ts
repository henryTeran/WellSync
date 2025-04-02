import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { combineLatest, firstValueFrom, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isAdmin$: Observable<any>;
  shouldShowChatbot$: Observable<any>; 

  constructor(
    private authService: AuthService, 
    private router: Router) {

    this.isAdmin$ = this.authService.isAdmin();
    this.shouldShowChatbot$ = combineLatest([
      this.authService.isAdmin(),
      this.authService.isAuthenticated()
    ]).pipe(
      map(([isAdmin, isLoggedIn]) => isLoggedIn && !isAdmin)
    );

  }
  
  async ngOnInit(): Promise<void> {
    const user = await firstValueFrom(this.authService.user$); 
    if (user) {
      this.isLoggedIn = !!user; 
    }

  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
