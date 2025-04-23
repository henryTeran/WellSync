import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';

export const authAnonymousGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const user = auth.currentUser;

  if (user && !user.isAnonymous) {
    return true;
  } else {
    await router.navigate(['/register']);
    return false;
  }
};
