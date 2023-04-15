import { TestBed } from '@angular/core/testing';

import { TopicResolver } from './topic.resolver';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TopicResolver', () => {
  let resolver: TopicResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    resolver = TestBed.inject(TopicResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
