import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../core/services/auth.service';
import { OpenAiService } from '../../core/services/openia.service';
import { NotificationService } from '../../core/services/notification.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let openAiServiceMock: jasmine.SpyObj<OpenAiService>;

  beforeEach(async () => {
    openAiServiceMock = jasmine.createSpyObj<OpenAiService>('OpenAiService', ['getLastRecommendation']);
    openAiServiceMock.getLastRecommendation.and.returnValue(Promise.reject(new Error('No data')));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            user$: of({ uid: 'u1' }),
          },
        },
        {
          provide: OpenAiService,
          useValue: openAiServiceMock,
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
        {
          provide: NotificationService,
          useValue: jasmine.createSpyObj('NotificationService', ['enableNotificationsForUser']),
        },
        {
          provide: ErrorHandlerService,
          useValue: jasmine.createSpyObj('ErrorHandlerService', ['logDevError', 'showUserError']),
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('retourne null si aucune recommandation', async () => {
    const value = await firstValueFrom(component.recommendationAlimentation$);
    expect(value).toBeNull();
  });
});
