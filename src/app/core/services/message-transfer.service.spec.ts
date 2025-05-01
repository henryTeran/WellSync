import { TestBed } from '@angular/core/testing';

import { MessageTransferService } from './message-transfer.service';

describe('MessageTransferService', () => {
  let service: MessageTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
