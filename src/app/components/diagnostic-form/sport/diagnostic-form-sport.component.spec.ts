import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticFormSportComponent } from './diagnostic-form-sport.component';

describe('DiagnosticFormSportComponent', () => {
  let component: DiagnosticFormSportComponent;
  let fixture: ComponentFixture<DiagnosticFormSportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticFormSportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosticFormSportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
