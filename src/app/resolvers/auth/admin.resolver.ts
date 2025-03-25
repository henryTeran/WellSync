import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export const adminResolver: ResolveFn<boolean> = async () => {
  const authService = inject(AuthService);
  const isAdmin = await firstValueFrom(authService.isAdmin());
  return isAdmin;
};


////faire en gaurd !!!! 
