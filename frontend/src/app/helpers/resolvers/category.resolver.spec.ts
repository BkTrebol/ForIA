import { TestBed } from '@angular/core/testing';

import { CategoryResolver } from './category.resolver';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CategoryResolver', () => {
  let resolver: CategoryResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    resolver = TestBed.inject(CategoryResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
