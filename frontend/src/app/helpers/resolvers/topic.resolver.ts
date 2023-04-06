import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { TopicService } from 'src/app/modules/topic/service/topic.service';

@Injectable({
  providedIn: 'root',
})
export class TopicResolver implements Resolve<boolean> {
  constructor(private topicService: TopicService, private router: Router) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const id = route.paramMap.get('id') ?? '';
    return this.topicService.posts(id).pipe(
      map((res) => {
        if (res) {
          return res;
        } else {
          this.router.navigate(['/category']); //Provisional (fer /category/2/topic/3)
          return null;
        }
      }),
      catchError((err) => {
        this.router.navigate(['/category']);
        return of(false);
      })
    );
  }
}
