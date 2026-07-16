import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { adminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';

describe('adminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => adminGuard(...guardParameters));

  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceMock: { user$: unknown; role$: unknown };

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.returnValue({} as any);
    authServiceMock = {
      user$: of({ uid: 'u1' }),
      role$: of('user'),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    });
  });

  it('autorise un admin', (done) => {
    authServiceMock.user$ = of({ uid: 'u1' });
    authServiceMock.role$ = of('admin');

    (executeGuard({} as any, {} as any) as any).subscribe((result: boolean) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('redirige un utilisateur non admin', (done) => {
    authServiceMock.user$ = of({ uid: 'u1' });
    authServiceMock.role$ = of('user');

    (executeGuard({} as any, {} as any) as any).subscribe((result: unknown) => {
      expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/app/home']);
      expect(result).toEqual({} as any);
      done();
    });
  });
});
