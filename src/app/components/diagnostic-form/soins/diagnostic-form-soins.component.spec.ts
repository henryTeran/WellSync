import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DiagnosticFormSoinsComponent } from './diagnostic-form-soins.component';
import { OpenAiService } from '../../../core/services/openia.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

describe('DiagnosticFormSoinsComponent', () => {
  let component: DiagnosticFormSoinsComponent;
  let fixture: ComponentFixture<DiagnosticFormSoinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticFormSoinsComponent],
      providers: [
        {
          provide: OpenAiService,
          useValue: jasmine.createSpyObj('OpenAiService', ['saveDiagnostic', 'enrichirAvecDiagnostic', 'saveRecommendation']),
        },
        {
          provide: AuthService,
          useValue: {
            user$: of({ uid: 'u1' }),
          },
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosticFormSoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('reconstruit les contrôles dynamiques au changement de type', () => {
    component.form.get('typeSoin')?.setValue('Soin visage');
    component.onTypeSelected();
    const firstControlName = component.steps[0].controlName;
    expect(component.form.contains(firstControlName)).toBeTrue();

    component.form.get('typeSoin')?.setValue('Massage');
    component.onTypeSelected();
    expect(component.form.contains(firstControlName)).toBeFalse();
  });
});
