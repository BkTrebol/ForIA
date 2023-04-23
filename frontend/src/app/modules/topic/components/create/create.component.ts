import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { Topic } from 'src/app/models/send/create-topic';
import { CategoryService } from 'src/app/modules/category/service/category.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss','../../../../styles/card.scss']
})
export class CreateComponent {

  private unsubscribe$: Subject<void>;
  public topic: Topic;
  public theme: string;
  public loading: boolean;
  public error:string;
  public editorConfig:AngularEditorConfig;
  constructor(
    private categoryService:CategoryService,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private router:Router
  ){
    this.unsubscribe$ = new Subject();
    this.loading = false;
    this.theme = this.themeService.getTheme();
    this.error = '';
    this.editorConfig = {
      minHeight: '200px',
      editable: true,
    };

    this.topic ={
      category_id:0,
      title:'',
      content:'',
      description:'',
      poll:{
        name:'',
        options:[{option:''}]
      }
    }
  }

  ngOnInit() {
    this.topic.category_id = parseInt(this.route.snapshot.paramMap.get('id') ?? '1'),

    this.themeService.theme
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((t) => {
      this.theme = t;
    });
  }
  onAddOption(){
    this.topic.poll.options.push({option:''})
    // this.topic.poll.options.push('')
  }
  onDeleteOption(index:number){
    this.topic.poll.options.splice(index,1)
    // this.topic.poll.options.splice(index, 1);
  }

  onSubmit(){
    this.categoryService.post(this.topic)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: r =>{
        this.router.navigate([`/topic/${r.id}`]);
      },
      error: e => console.log(e)
    });
  }
}
