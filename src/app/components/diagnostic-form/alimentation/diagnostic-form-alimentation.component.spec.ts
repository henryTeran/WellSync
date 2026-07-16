import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticFormAlimentationComponent } from './diagnostic-form-alimentation.component';

describe('DiagnosticFormAlimentationComponent', () => {
  let component: DiagnosticFormAlimentationComponent;
  let fixture: ComponentFixture<DiagnosticFormAlimentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticFormAlimentationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosticFormAlimentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
