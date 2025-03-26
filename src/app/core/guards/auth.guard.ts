import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { user } from '@angular/fire/auth';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router); 

  return authService.user$.pipe(
    map(user => user ? true : router.createUrlTree(['/login']))
  );
};
