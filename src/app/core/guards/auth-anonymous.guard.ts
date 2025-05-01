import { inject } from '@angular/core';
import { Auth, signInAnonymously } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';

export const authAnonymousGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);

  let user = auth.currentUser;

  if (!user) {
    try {
      const cred = await signInAnonymously(auth);
      user = cred.user;
      console.log("créationGuard")
    } catch (error) {
      console.error("Erreur lors de la création du compte anonyme :", error);
      await router.navigate(['app/register']);
      return false;
    }
  }

  return true;
};
