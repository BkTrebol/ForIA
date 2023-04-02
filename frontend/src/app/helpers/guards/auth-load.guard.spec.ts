import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AuthLoadGuard } from './auth-load.guard';

describe('AuthLoadGuard', () => {
  let guard: AuthLoadGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    guard = TestBed.inject(AuthLoadGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
