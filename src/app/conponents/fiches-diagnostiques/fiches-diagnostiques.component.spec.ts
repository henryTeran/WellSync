import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesDiagnostiquesComponent } from './fiches-diagnostiques.component';

describe('FichesDiagnostiquesComponent', () => {
  let component: FichesDiagnostiquesComponent;
  let fixture: ComponentFixture<FichesDiagnostiquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichesDiagnostiquesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichesDiagnostiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
