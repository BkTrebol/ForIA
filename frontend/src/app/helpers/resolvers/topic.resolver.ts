import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { TopicService } from 'src/app/modules/topic/service/topic.service';
import { ListPosts } from 'src/app/models/receive/list-posts';

@Injectable({
  providedIn: 'root',
})
export class TopicResolver implements Resolve<boolean | ListPosts> {
  constructor(private topicService: TopicService, private router: Router) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | ListPosts> {
    const id = route.paramMap.get('id') ?? '';
    const page = route.params['page'] ?? '1';

    return this.topicService.posts(id, page).pipe(
      map((res) => {
        if (res) {
          return res;
        } else {
          this.router.navigate(['/category']); //Provisional (fer /category/2/topic/3)
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
