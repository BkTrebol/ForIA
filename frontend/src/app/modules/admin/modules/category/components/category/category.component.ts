import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CategoryService } from '../../service/category.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { uniqueTitleValidator } from 'src/app/helpers/validators';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { Global } from 'src/environment/global';
import { Section } from 'src/app/models/receive/admin-category';
import { Role } from 'src/app/models/receive/admin-role';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CategoryComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  public sections: Array<Section> = [];
  public connectedTo: string[] = [];
  public categoryForm: FormGroup;
  public sectionForm: FormGroup;
  public catToDelete: string;
  public newCategoryMode: boolean;
  public newSectionMode: boolean;
  public sectionList: Array<{name:string,id?:number}>;
  public titleList: Array<string>;
  public saveLoading: boolean;
  public roleList: Array<Role>;
  public catImage?: File;
  public index: number;
  public cindex: number;
  public imageUrl: string;
  public userMaxRole: number;
  public formData: FormData;
  constructor(
    private _fb: FormBuilder,
    private _categoryService: CategoryService,
    private _modalService: NgbModal,
    private _toastService: ToastService
  ) {
    this.formData = new FormData();
    this.userMaxRole = 0;
    this.imageUrl = '';
    this.index = 0;
    this.cindex = 0;
    this.unsubscribe$ = new Subject();
    this.roleList = [];
    this.saveLoading = false;
    this.sectionList = [];
    this.titleList = [];
    this.newCategoryMode = false;
    this.newSectionMode = false;
    this.categoryForm = this._fb.group({});
    this.sectionForm = this._fb.group({});
    this.loading = false;
    this.catToDelete = '';
  }

  ngOnInit(): void {
    this.loading = true;
    this.getData();
    this.getRoles();
  }

  getData() {
    this._categoryService
      .getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((r) => {
        this.sections = r.categories;
        this.userMaxRole = r.userMaxRole;
        this.sectionList = r.categories.map((section: any, index: number) => {
          return {
            name: section.name,
            id: index,
          };
        });
        this.sectionList.unshift({ name: '' });
        this.loading = false;
        this.saveLoading = false;
        this.connectedTo = this.sections.map((_, index) => `list${index}`);
      });
  }

  getRoles() {
    this._categoryService
      .getRoles()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          console.log(r);
          this.roleList = r;
        },
      });
  }

  dropCategory(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  dropSection(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
  }

  editCategory(category: any, index: number, cindex: number) {
    this.newCategoryMode = false;
    this.index = index;
    this.cindex = cindex;
    this.imageUrl =
      this.sections[index].categories[cindex].image === '' ||
        this.sections[index].categories[cindex].image === null
        ? ''
        : `${Global.api}upload/images/${this.sections[index].categories[cindex].image}`;
    this.categoryForm = this._fb.group({
      id: [this.sections[index].categories[cindex].id],
      section: [this.sections[index].categories[cindex].section],
      can_mod: [
        this.sections[index].categories[cindex].can_mod,
        [Validators.required],
      ],
      can_post: [
        this.sections[index].categories[cindex].can_post,
        [Validators.required],
      ],
      can_view: [
        this.sections[index].categories[cindex].can_view,
        [Validators.required],
      ],
      description: [
        this.sections[index].categories[cindex].description,
        [Validators.maxLength(250)],
      ],
      // image: [this.sections[index].categories[cindex].image],
      image: [],
      music: [this.sections[index].categories[cindex].music],
      title: [
        this.sections[index].categories[cindex].title,
        [
          Validators.required,
          Validators.maxLength(50),
          uniqueTitleValidator(
            this.sections,
            this.sections[index].categories[cindex].title
          ),
        ],
      ],
    });
    if(this.can_view?.value >= this.userMaxRole) {this.can_view?.disable(); this.formData.append('can_view',this.can_view?.value)}
    if(this.can_post?.value >= this.userMaxRole) {this.can_post?.disable();this.formData.append('can_post',this.can_post?.value)}
    if(this.can_mod?.value >= this.userMaxRole) {this.can_mod?.disable();this.formData.append('can_mod',this.can_mod?.value)}
    this._modalService.open(category);
  }

  deleteCategory(category: any, index: number, cindex: number) {
    this.catToDelete = this.sections[index].categories[cindex].title;
    this._modalService.open(category).result.then(
      (result) => {
        if (result) {
          this.sections[index].categories.splice(cindex, 1);
        }
      },
      () => { }
    ); // Avoid error for unhdandled Dismiss
  }

  createCategory(category: any) {
    this.newCategoryMode = true;
    this.categoryForm = this._fb.group({
      id: [],
      section: [null, [Validators.required]],
      newId: [],
      can_mod: [null, [Validators.required]],
      can_post: [null, [Validators.required]],
      can_view: [null, [Validators.required]],
      description: ['', [Validators.maxLength(250)]],
      image: [],
      music: [],
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          uniqueTitleValidator(this.sections),
        ],
      ],
    });
    this._modalService.open(category);
  }

  saveCategory() {
    this.saveLoading = true;

    Object.keys(this.categoryForm.value).forEach(key => {
      if (key !== 'image') this.formData.append(key, this.categoryForm.get(key)?.value);
    });
    if (this.catImage instanceof File) {
      this.formData.append('image', this.catImage);
    }
    
    this._categoryService
      .saveCategory(this.formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: data => {
          const sectionId = this.sections.indexOf(
            this.sections.find((s:Section) => s.name === data.category.section)??this.sections[0]
            )
          if (!this.newCategoryMode) {
            this.sections[this.index].categories[this.cindex] = data.category;
          } else {
            this.sections[sectionId].categories.push(data.category);
          }
          this.categoryForm = this._fb.group({});
          this.saveLoading = false;
          this.formData = new FormData();
          this._toastService.show(data.message)
          this._modalService.dismissAll();
        },
        error: ee => {
          this.saveLoading = false;
          this._toastService.show(ee);
          this._modalService.dismissAll();
        }
      })
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.catImage = event.target.files[0];
      if (this.catImage) this.imageUrl = URL.createObjectURL(this.catImage);
    }
  }

  createSection(sectionModal: any) {
    this.newSectionMode = true;
    this.sectionForm = this._fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
    });
    this._modalService.open(sectionModal).result.then(
      (result) => {
        if (result && this.sectionForm.valid) {
          this.sections.push({
            name: this.sectionForm.value.name,
            categories: [],
          });
          this.sectionList = this.sections.map(
            (section: any, index: number) => {
              return {
                name: section.name,
                id: index,
              };
            }
          );
        }
      },
      () => {
        this.sectionForm = this._fb.group({});
      }
    );
  }

  editSection(sectionModal: any, sindex: number) {
    this.newSectionMode = false;
    this.sectionForm = this._fb.group({
      name: [
        this.sections[sindex].name,
        [Validators.required, Validators.maxLength(250)],
      ],
    });
    this._modalService.open(sectionModal).result.then(
      (result) => {
        if (result && this.sectionForm.valid) {
          this.sections[sindex].name = this.sectionForm.value.name;
          this.sectionList = this.sections.map(
            (section: any, index: number) => {
              return {
                name: section.name,
                id: index,
              };
            }
          );
        }
      },
      () => {
        this.sectionForm = this._fb.group({});
      }
    );
  }

  onSubmit() {
    let index = 1;
    const sendCatList = [];
    this.saveLoading = true;
    for (let section of this.sections) {
      for (let category of section.categories) {
        const newCat = {
          order: index,
          section: section.name,
          id: category.id,
        };
        category.order = index;
        category.section = section.name;
        sendCatList.push(newCat);
        index++;
      }
    }
    this._categoryService.saveCategories(sendCatList)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          this.getData();
          this._toastService.show(r);
        },
        error: (e) => {
          this.getData();
        },
      });
  }

  get title() {
    return this.categoryForm.get('title');
  }
  get can_mod() {
    return this.categoryForm.get('can_mod');
  }
  get can_post() {
    return this.categoryForm.get('can_post');
  }
  get can_view() {
    return this.categoryForm.get('can_view');
  }
  get section() {
    return this.categoryForm.get('section');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
