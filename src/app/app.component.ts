import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoggedIn = false;
  isAdmin = false;

  constructor(public authService: AuthService, private router: Router) {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    this.authService.role$.subscribe(role => {
      this.isAdmin = role === 'admin';
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
