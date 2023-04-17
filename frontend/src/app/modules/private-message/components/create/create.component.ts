import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { PrivateMessageService } from '../../service/private-message.service';
import { Observable } from 'rxjs';
import { newPrivateMessage } from 'src/app/models/receive/list-pm';

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
  public message:newPrivateMessage;
  public editorConfig: AngularEditorConfig;
  constructor(
    private privateMessageService: PrivateMessageService,
  ){
    this.message = {
      recipient:NaN,
      title:'',
      content:'',
    }
    this.editorConfig = {
      height:'200px',
      editable:true,
    }
  }
  ngOnInit(): void {
    
    this.userList$ = this.privateMessageService.getUserList(this.user??'');
  }
  onSubmit() {
    this.privateMessageService.sendMessage(this.message).subscribe({
      next: r => console.log(r),
      error: e => console.log(e),
    })
  }

  onSelectChange(event:any){
    this.message.recipient = event.id;
  }
}
