import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';

describe('AuthService Test', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getIsAuth should return false', () => {
    expect(service.getIsAuth()).toBe(false);
  });

  // it('#getAuthStatusListener should return false from observable', (done: DoneFn) => {
  //   service.getAuthStatusListener().subscribe((value) => {
  //     expect(value).toBe(false);
  //     done();
  //   });
  // });

});
