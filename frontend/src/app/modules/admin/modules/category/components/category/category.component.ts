import { AfterViewInit, Component, OnInit  } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CategoryService } from '../../service/category.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  public loading:boolean;
  public sections: Array<any> = [];
  public connectedTo: string[] = [];
  public categoryForm: FormGroup;
  public sectionForm: FormGroup;
  public catToDelete:string;
  public newCategoryMode:boolean;
  public sectionList:Array<{name:string,id:number}>
  constructor(
    private _fb: FormBuilder,
    private _categoryService: CategoryService,
    private _modalService: NgbModal,
  ){
    this.sectionList = [];
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
    this._categoryService.categories().subscribe(
      (r) => {console.log(r)
      this.sections = r;
      this.sectionList = r.map((section:any,index:number) =>{
        return {
          name:section.name,
          id:index,
        }
      })
      this.sectionList.unshift({name:'',id:NaN});
      console.log(this.sectionList)
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
        can_mod: [this.sections[index].categories[cindex].can_mod],
        can_post: [this.sections[index].categories[cindex].can_post],
        can_view: [this.sections[index].categories[cindex].can_view],
        description: [this.sections[index].categories[cindex].description,[Validators.maxLength(250)]],
        image: [this.sections[index].categories[cindex].image],
        music: [this.sections[index].categories[cindex].music],
        title: [this.sections[index].categories[cindex].title, [Validators.required, Validators.maxLength(50)]]
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
        can_mod: [],
        can_post: [],
        can_view: [],
        description: ['',[Validators.maxLength(250)]],
        image: [],
        music: [],
        title: ['',[Validators.required, Validators.maxLength(50)]]
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
          category.newId = index;
          category.section = section.name;
          sendCatList.push(category);
          index++
        }
      }
      console.log(sendCatList);
    }
}
