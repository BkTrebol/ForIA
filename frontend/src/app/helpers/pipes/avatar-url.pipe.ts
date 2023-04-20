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

@Pipe({
  name: 'toDate',
})
export class ToDatePipe implements PipeTransform {
  transform(value: string): Date {
    return new Date(value);
  }
}

@Pipe({
  name: 'short',
})
export class Short implements PipeTransform {
  transform(value: string): string {
    return value.replace("minutes", "min");
  }
}