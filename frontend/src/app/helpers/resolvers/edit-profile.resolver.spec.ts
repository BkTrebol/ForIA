import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { EditProfileResolver } from './edit-profile.resolver';

describe('EditProfileResolver', () => {
  let resolver: EditProfileResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    resolver = TestBed.inject(EditProfileResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
