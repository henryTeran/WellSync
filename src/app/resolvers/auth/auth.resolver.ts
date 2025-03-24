import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';

export const authResolver: ResolveFn<any> = async () => {
  const auth = inject(Auth);
  return firstValueFrom(user(auth));
};
