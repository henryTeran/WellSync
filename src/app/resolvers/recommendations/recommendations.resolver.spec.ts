import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { recommendationsResolver } from './recommendations.resolver';

describe('recommendationsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => recommendationsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
