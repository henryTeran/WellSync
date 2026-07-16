import { inject } from '@angular/core';
import { Auth, signInAnonymously } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';

export const authAnonymousGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);

  let user = auth.currentUser;

  if (!user) {
    try {
      const credential = await signInAnonymously(auth);
      user = credential.user;
    } catch (error) {
      console.error('Erreur lors de la création du compte anonyme :', error);
      return router.createUrlTree(['/app/login']);
    }
  }

  return !!user;
};