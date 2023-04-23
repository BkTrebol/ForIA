import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CheckGuard } from './check.guard';

describe('CheckGuard', () => {
  let guard: CheckGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientModule] });
    guard = TestBed.inject(CheckGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
