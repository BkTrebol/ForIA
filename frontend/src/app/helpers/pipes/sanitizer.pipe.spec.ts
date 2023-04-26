import { TestBed } from '@angular/core/testing';
import { SanitizerPipe } from './sanitizer.pipe';
import {
  BrowserModule, DomSanitizer,
} from '@angular/platform-browser';

describe('SanitizerPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
    });
  });

  it('create an instance', () => {
    const domSanitizer = TestBed.inject(DomSanitizer);
    const pipe = new SanitizerPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  });
});
