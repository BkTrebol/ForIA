import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ago',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string): string {
    const time = new Date(value);
    const seconds = Math.floor((new Date().getTime() - time.getTime()) / 1000);

    if (seconds < 60) {
      return 'just now';
    } else if (seconds < 120) {
      return 'a minute ago';
    } else if (seconds < 3600) {
      return Math.floor(seconds / 60) + ' min ago';
    } else if (seconds < 7200) {
      return 'an hour ago';
    } else if (seconds < 86400) {
      return Math.floor(seconds / 3600) + ' h. ago';
    } else if (seconds < 172800) {
      return 'a day ago';
    } else {
      return time.toLocaleString().split(',')[0];
    }
  }
}

@Pipe({
  name: 'finished',
})
export class FinshsedPipe implements PipeTransform {
  transform(value: string): number {
    if (!value) {
      return 0
    }
    return Math.floor(
      (new Date().getTime() - new Date(value).getTime()) / 1000
    );
  }
}
