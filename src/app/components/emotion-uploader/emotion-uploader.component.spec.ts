import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmotionUploaderComponent } from './emotion-uploader.component';

describe('EmotionUploaderComponent', () => {
  let component: EmotionUploaderComponent;
  let fixture: ComponentFixture<EmotionUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmotionUploaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmotionUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
