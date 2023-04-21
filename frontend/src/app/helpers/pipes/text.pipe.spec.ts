import { CapitalizePipe } from './text.pipe';

describe('TextPipe', () => {
  it('create an instance', () => {
    const pipe = new CapitalizePipe();
    expect(pipe).toBeTruthy();
  });
});
