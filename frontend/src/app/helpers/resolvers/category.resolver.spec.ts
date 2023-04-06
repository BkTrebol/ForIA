import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CategoryResolver } from './category.resolver';

describe('CategoryResolver', () => {
  let resolver: CategoryResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    resolver = TestBed.inject(CategoryResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
