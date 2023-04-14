import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatarUrl',
})
export class AvatarUrlPipe implements PipeTransform {
  public regexUrl: RegExp;
  constructor() {
    this.regexUrl = /https?:\/\/.+\..+/;
  }
  transform(value: string, ...args: unknown[]): unknown {
    return this.regexUrl.test(value);
  }
}
