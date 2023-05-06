import { AfterViewInit, Component, OnInit  } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CategoryService } from '../../service/category.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  public loading:boolean;
  public sections: Array<any> = [];
  public connectedTo: string[] = [];
  constructor(
    private _categoryService: CategoryService,
    private _modalService: NgbModal,
  ){
    this.loading = false;
  }
  ngOnInit() {
    this.getData()
  }

  getData(){
    this.loading = true;
    this._categoryService.categories().subscribe(
      (r) => {console.log(r)
      this.sections = r;
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
      console.log('Sectin:'+index,"Cat:"+cindex);
      console.log(this.sections[index].categories[cindex])
      this._modalService.open(category);

    }
  
    deleteCategory(category:any,index:number,cindex:number) {

      this._modalService.open(category);

    }
  
    createCategory(section:any) {

    }
  
    createSection(sectionModal:any) {
      console.log('Crear sección');
      this._modalService.open(sectionModal)
    }

    onSubmit(){
      let index = 0;
      for (let section of this.sections) {
        for(let category of section.categories) {
          category.id = index;
          category.section = section.name;
          index++
        }
      }
      console.log(this.sections);
    }
}
