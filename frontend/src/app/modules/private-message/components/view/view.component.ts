import { Component, OnInit } from '@angular/core';
import { PrivateMessage } from 'src/app/models/receive/list-pm';
import { PrivateMessageService } from '../../service/private-message.service';
import { ActivatedRoute } from '@angular/router';
import { Global } from 'src/app/environment/global';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  public privateMessage?: PrivateMessage;
  public loading: boolean = false;
  public apiUrl: string;
  constructor(
    private privateMessageService: PrivateMessageService,
    private router: ActivatedRoute,
  ){
    this.apiUrl = Global.api;
  }

  ngOnInit() {
    const id = this.router.snapshot.paramMap.get('id')??'';

    this.privateMessageService.getMessage(id)
    .subscribe({
      next: r => {
        console.log(r)
        this.privateMessage = r
        this.loading = false;
      },
      error: e => console.log(e),
    });
  }

}
