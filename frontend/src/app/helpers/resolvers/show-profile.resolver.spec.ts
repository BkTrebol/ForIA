import { TestBed } from '@angular/core/testing';

import { ShowProfileResolver } from './show-profile.resolver';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ShowProfileResolver', () => {
  let resolver: ShowProfileResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    resolver = TestBed.inject(ShowProfileResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
