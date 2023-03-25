import { TestBed } from '@angular/core/testing';
import { RoleGuard } from './role.guard';
import { HttpClientModule } from '@angular/common/http';

describe('RoleGuard', () => {
  let guard: RoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    guard = TestBed.inject(RoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
