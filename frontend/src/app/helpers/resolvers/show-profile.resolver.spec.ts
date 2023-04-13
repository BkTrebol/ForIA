import { TestBed } from '@angular/core/testing';

import { ShowProfileResolver } from './show-profile.resolver';

describe('ShowProfileResolver', () => {
  let resolver: ShowProfileResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ShowProfileResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
