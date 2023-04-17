import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSubject: BehaviorSubject<any>;
  public theme: Observable<string>;
  public prefersDarkScheme: MediaQueryList;

  constructor() {
    this.prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    this.themeSubject = new BehaviorSubject(this.getTheme());
    this.theme = this.themeSubject.asObservable();
  }

  changeTheme(them: string): void {
    this.themeSubject.next(them);
    localStorage.setItem('theme', them);
  }

  getTheme(): string {
    let t = localStorage.getItem('theme');
    if (t == '' || t == null || t == undefined) {
      t = this.prefersDarkScheme.matches ? 'dark' : 'light';
    }
    return t;
  }
}
