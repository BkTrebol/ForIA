import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { CategoryService } from 'src/app/modules/category/service/category.service';
import { ListTopics } from 'src/app/models/receive/list-topics';

@Injectable({
  providedIn: 'root',
})
export class CategoryResolver implements Resolve<boolean | ListTopics> {
  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | ListTopics> {
    const id = route.paramMap.get('id') ?? '';
    const page = route.queryParams['page'] ?? '1';
    return this.categoryService.topics(id, page).pipe(
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
