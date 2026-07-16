import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { combineLatest, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return combineLatest([authService.user$, authService.role$]).pipe(
    take(1),
    map(([user, role]) => {
      if (!user) {
        return router.createUrlTree(['/app/login']);
      }

      return role === 'admin' ? true : router.createUrlTree(['/app/home']);
    }),
  );
};