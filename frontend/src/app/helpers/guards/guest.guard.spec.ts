import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { GuestGuard } from './guest.guard';

describe('GuestGuard', () => {
  let guard: GuestGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    guard = TestBed.inject(GuestGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
