import { TimeAgoPipe } from './dates.pipe';

describe('DatesPipe', () => {
  it('create an instance', () => {
    const pipe = new TimeAgoPipe();
    expect(pipe).toBeTruthy();
  });
});
