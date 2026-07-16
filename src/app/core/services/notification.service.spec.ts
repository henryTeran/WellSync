import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Messaging } from '@angular/fire/messaging';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Firestore } from '@angular/fire/firestore';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  const authMock = {
    currentUser: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: Auth,
          useValue: authMock,
        },
        {
          provide: Messaging,
          useValue: {},
        },
        {
          provide: Firestore,
          useValue: {},
        },
      ],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('retourne null si utilisateur non connecté', async () => {
    const token = await service.enableNotificationsForUser();
    expect(token).toBeNull();
  });
});
