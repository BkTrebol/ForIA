import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    return (
      value.charAt(0).toUpperCase() + value.slice(1)
    );
  }
}

@Pipe({
  name: 'seconds',
})
export class SecondsPipe implements PipeTransform {
  transform(seconds: number): string {
    if (isNaN(seconds)) {
      return ''
    }
    const  minutes = Math.floor(seconds / 60);
    let secs: string | number = Math.floor(seconds % 60);
    if (secs < 10) {
      secs = '0' + secs;
    }
    return minutes + ':' + secs;
  }
}
