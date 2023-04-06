import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { CategoryService } from 'src/app/modules/category/service/category.service';
import { ListTopic } from 'src/app/models/receive/list-topics';

@Injectable({
  providedIn: 'root',
})
export class CategoryResolver implements Resolve<boolean | ListTopic> {
  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | ListTopic> {
    const id = route.paramMap.get('id') ?? '';
    return this.categoryService.topics(id).pipe(
      map((res) => {
        if (res) {
          return res;
        } else {
          this.router.navigate(['/category']);
          return false;
        }
      }),
      catchError((err) => {
        this.router.navigate(['/category']);
        return of(false);
      })
    );
  }
}
