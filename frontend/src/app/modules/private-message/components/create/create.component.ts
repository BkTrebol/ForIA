import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { PrivateMessageService } from '../../service/private-message.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss','../../../../styles/card.scss']
})
export class CreateComponent implements OnInit {

  public loading: boolean = false;
  public content: string = "";
  public userList$:Observable<any> = new Observable();
  public user?:string;
  public title?:string;
  public editorConfig: AngularEditorConfig;
  constructor(
    private privateMessageService: PrivateMessageService,
  ){
    this.editorConfig = {
      height:'200px',
      editable:true,
    }
  }
  ngOnInit(): void {
    this.userList$ = this.privateMessageService.getUserList(this.user??'');
  }
  onSubmit() {
    console.log(this.content)
  }

  // onSearch(){
  //   this.privateMessageService.getUserList(this.search)
  //   .subscribe({
  //     next: r => {
  //       console.log('search;',this.search,'r',r)
  //       // this.userList = r;
  //     },
  //     error: e => console.log(e)
  //   })
  // }

  onSelectChange(event:any){
    console.log(event)
  }
}
