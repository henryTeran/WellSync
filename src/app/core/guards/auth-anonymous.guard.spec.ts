import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authAnonymousGuard } from './auth-anonymous.guard';

describe('authAnonymousGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authAnonymousGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
