import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { TopicResolver } from './topic.resolver';

describe('TopicResolver', () => {
  let resolver: TopicResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    resolver = TestBed.inject(TopicResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
