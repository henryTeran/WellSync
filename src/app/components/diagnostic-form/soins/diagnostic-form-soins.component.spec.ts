import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticFormSoinsComponent } from './diagnostic-form-soins.component';

describe('DiagnosticFormSoinsComponent', () => {
  let component: DiagnosticFormSoinsComponent;
  let fixture: ComponentFixture<DiagnosticFormSoinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticFormSoinsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosticFormSoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
