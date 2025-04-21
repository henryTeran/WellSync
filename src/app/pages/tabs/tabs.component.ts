import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  imports: [IonicModule, CommonModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabsComponent  implements OnInit {
  user$: Observable <User | null>; 

  constructor(private _authService: AuthService, private _router: Router) {
    this.user$ = _authService.user$; 
    console.log(firstValueFrom( this.user$));
   }

  ngOnInit() {}
  async logout() {
    await this._authService.logout();
    this._router.navigate(['app/login']);
  }

}
