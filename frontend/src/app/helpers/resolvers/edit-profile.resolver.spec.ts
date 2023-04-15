import { TestBed } from '@angular/core/testing';

import { EditProfileResolver } from './edit-profile.resolver';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditProfileResolver', () => {
  let resolver: EditProfileResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    resolver = TestBed.inject(EditProfileResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
