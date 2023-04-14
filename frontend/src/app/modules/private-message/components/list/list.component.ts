import { Component, OnInit } from '@angular/core';
import { PrivateMessageService } from '../../service/private-message.service';
import { ListPm } from 'src/app/models/receive/list-pm';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss','../../../../styles/card.scss']
})
export class ListComponent implements OnInit {

  public privateMessageList?: ListPm;
  public loading: boolean = true;

  constructor(
    private privateMessageService: PrivateMessageService
  ){  }

  ngOnInit(){
    this.privateMessageService.getList()
    .subscribe({
      next: (r) => {
        this.privateMessageList = r;
        this.loading = false;
      },
      error: e => console.log(e)
    })
  }

  deletePm(id:number){

  }
}
