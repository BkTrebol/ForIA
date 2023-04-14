import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSubject: BehaviorSubject<any>;
  public theme: Observable<string>;

  constructor() {
    this.themeSubject = new BehaviorSubject(
      localStorage.getItem('theme') ?? ''
    );
    this.theme = this.themeSubject.asObservable();
  }

  changeTheme(them: string): void {
      this.themeSubject.next(them);
  }
}
