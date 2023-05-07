import { AfterViewInit, Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CategoryService } from '../../service/category.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { uniqueTitleValidator } from '../../helpers';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryComponent implements OnInit {
  public loading:boolean;
  public sections: Array<any> = [];
  public connectedTo: string[] = [];
  public categoryForm: FormGroup;
  public sectionForm: FormGroup;
  public catToDelete:string;
  public newCategoryMode:boolean;
  public sectionList:Array<any>
  public titleList:Array<string>
  constructor(
    private _fb: FormBuilder,
    private _categoryService: CategoryService,
    private _modalService: NgbModal,
  ){
    this.sectionList = [];
    this.titleList = [];
    this.newCategoryMode = false;
    this.categoryForm = this._fb.group({});
    this.sectionForm = this._fb.group({});
    this.loading = false;
    this.catToDelete = '';
  }
  ngOnInit() {
    this.getData()
  }

  getData(){
    this.loading = true;
    this._categoryService.getCategories().subscribe(
      (r) => {
        console.log(r)
      this.sections = r;
      this.sectionList = r.map((section:any,index:number) =>{
        return {
          name:section.name,
          id:index,
        }
      })

      this.sectionList.unshift({name:''});
      this.loading = false;
      this.connectedTo = this.sections.map((_, index) => `list${index}`);
      }
    );
  }

  dropCategory(event: CdkDragDrop<any[]>) {
    // console.log(event)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  dropSection(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
  }

    editCategory(category:any,index:number,cindex:number) {
      this.newCategoryMode = false;
      this.categoryForm = this._fb.group({
        id:[this.sections[index].categories[cindex].id],
        section:[this.sections[index].categories[cindex].section],
        newId:[this.sections[index].categories[cindex].newId??this.sections[index].categories[cindex].id],
        can_mod: [this.sections[index].categories[cindex].can_mod,[Validators.required]],
        can_post: [this.sections[index].categories[cindex].can_post,[Validators.required]],
        can_view: [this.sections[index].categories[cindex].can_view,[Validators.required]],
        description: [this.sections[index].categories[cindex].description,[Validators.maxLength(250)]],
        image: [this.sections[index].categories[cindex].image],
        music: [this.sections[index].categories[cindex].music],
        title: [this.sections[index].categories[cindex].title, [Validators.required, Validators.maxLength(50),uniqueTitleValidator(this.sections,this.sections[index].categories[cindex].title)]]
      });
      this._modalService.open(category).result.then(
        (result) => {
        if(result){
          this.sections[index].categories[cindex] = this.categoryForm.value
          this.categoryForm = this._fb.group({});
        }
      },() => {
        this.categoryForm = this._fb.group({});
      }); // Avoid error for unhdandled Dismiss
    }
  
    deleteCategory(category:any,index:number,cindex:number) {
      this.catToDelete = this.sections[index].categories[cindex].title;
      this._modalService.open(category).result.then(result => {
        if(result){
          this.sections[index].categories.splice(cindex,1);
        }
      },
      () => {}); // Avoid error for unhdandled Dismiss
    }
  
    createCategory(category:any) {
      this.newCategoryMode = true;
      this.categoryForm = this._fb.group({
        id:[],
        section:[null,[Validators.required]],
        newId:[],
        can_mod: [null,[Validators.required]],
        can_post: [null,[Validators.required]],
        can_view: [null,[Validators.required]],
        description: ['',[Validators.maxLength(250)]],
        image: [],
        music: [],
        title: ['',[Validators.required, Validators.maxLength(50),uniqueTitleValidator(this.sections)]]
      });
      this._modalService.open(category).result.then(
        (result) => {
        if(result){
          this.sections[this.categoryForm.value.section].categories.push(this.categoryForm.value);
        }
      },() => {
        this.categoryForm = this._fb.group({});
      });
    }
  
    createSection(sectionModal:any) {
      this.sectionForm = this._fb.group({
        name:['',[Validators.required,Validators.maxLength(250)]]
      })
      this._modalService.open(sectionModal).result.then(
        (result) => {
        if(result){
          this.sections.push({
            name:this.sectionForm.value.name,
            categories:[],
          })

          this.sectionList = this.sections.map((section:any,index:number) =>{
            return {
              name:section.name,
              id:index,
            }
          })
        }
      },() => {
        this.sectionForm = this._fb.group({});
      });
    }

    editSection(sectionModal:any,sindex:number){
      this.sectionForm = this._fb.group({
        name:[this.sections[sindex].name,[Validators.required,Validators.maxLength(250)]]
      })
      this._modalService.open(sectionModal).result.then(
        (result) => {
        if(result){
          this.sections[sindex].name = this.sectionForm.value.name

          this.sectionList = this.sections.map((section:any,index:number) =>{
            return {
              name:section.name,
              id:index,
            }
          })
        }
      },() => {
        this.sectionForm = this._fb.group({});
      });
    }

    onSubmit(){
      let index = 1;
      const sendCatList = [];

      for (let section of this.sections) {
        for(let category of section.categories) {
          // const newCat = ...category
          category.order = index;
          category.section = section.name;
          sendCatList.push(category);
          index++
        }
      }
      this._categoryService.saveCategories(sendCatList).subscribe({
        next: r => {
          this.getData();
          console.log(r);
        },
        error: e => {
          this.getData();
          console.log(e);
        }
      });
    }

    get title() { return this.categoryForm.get('title')}
    get can_mod() { return this.categoryForm.get('can_mod')}
    get can_post() { return this.categoryForm.get('can_post')}
    get can_view() { return this.categoryForm.get('can_view')}
    get section() { return this.categoryForm.get('section')}
}
