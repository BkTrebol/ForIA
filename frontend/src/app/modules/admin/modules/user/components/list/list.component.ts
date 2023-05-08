import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit,OnDestroy {
  private unsubscribe$: Subject<void>;
  public loading:boolean;
  public tableLoading:boolean;
  public tableData:any;
  public roleList:Array<any>;
  public filters:{
    page?:number,
    order?:string,
    dir?:'asc' | 'desc',
    nick?:string,
    verified?:boolean,
    suspension?:boolean,
    google?:boolean,
    roles?:Array<number>,
    rolesAll?:boolean;
  };


  constructor(
    private _userService: UserService
  ){
    this.tableLoading = true;
    this.unsubscribe$ = new Subject();
    this.roleList = [];
    this.filters = {
      page:1,
    };
    this.loading = true;
    this.tableData = [];
  }

  ngOnInit() {
    this.getData()
    this.getRoles();
  }

  getData(){
    this.tableLoading = true;
    const parsedFilters = this.parseFilters();
    console.log(parsedFilters);
    this._userService.getList(parsedFilters)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: r => {
        console.log(r)
        this.loading = false;
        this.tableLoading = false;
        this.tableData = r;
      }
    });
  }

  getRoles(){
    this._userService.getRoles()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: r => {
        this.roleList = r;
      }
    })
  }

  onChangePage(event: any) {
    this.filters.page = event.offset+1;
    this.getData();
  }

  onSort(event:any) {
    console.log(event.sorts)
    this.filters.order = event.sorts[0].prop;
    this.filters.dir = event.sorts[0].dir;
    console.log(this.filters)
    this.getData();
  }

  onFilter(){
    this.getData();
  }
  parseFilters(){
    const params = new URLSearchParams();

  Object.entries(this.filters).forEach(([key,value]) => {
    if ( value !== undefined &&  value !== null && value !== 'null' 
        && value !== '' && value !== 'undefined') {
          if(key === 'roles' && this.filters.roles?.length !== 0){
            params.set(key, value.toString());
          } else if(key !== 'roles'){
            params.set(key, value.toString());
          }
      
    }
  })
  return params.toString() ? '?' + params.toString() : '';
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}



