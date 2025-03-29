import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmotionLiveComponent } from './emotion-live.component';

describe('EmotionLiveComponent', () => {
  let component: EmotionLiveComponent;
  let fixture: ComponentFixture<EmotionLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmotionLiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmotionLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
