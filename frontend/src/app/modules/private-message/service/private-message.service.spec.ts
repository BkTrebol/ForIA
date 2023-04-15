import { TestBed } from '@angular/core/testing';

import { PrivateMessageService } from './private-message.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PrivateMessageService', () => {
  let service: PrivateMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PrivateMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
