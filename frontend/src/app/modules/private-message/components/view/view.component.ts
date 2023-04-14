import { Component, OnInit } from '@angular/core';
import { PrivateMessage } from 'src/app/models/receive/list-pm';
import { PrivateMessageService } from '../../service/private-message.service';
import { ActivatedRoute } from '@angular/router';
import { Global } from 'src/app/environment/global';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss','../../../../styles/card.scss']
})
export class ViewComponent implements OnInit {

  public privateMessage?: PrivateMessage;
  public loading: boolean = true;;
  public apiUrl: string;
  private topicId: string = '';
  private page :number = 1;
  constructor(
    private privateMessageService: PrivateMessageService,
    private route: ActivatedRoute,
  ){
    this.apiUrl = Global.api+'user/get-avatar/';
  }

  ngOnInit() {
    this.topicId  = this.route.snapshot.paramMap.get('id')??'';
    this.page = this.route.snapshot.queryParams['page']??1;
    this.getData();
  }

  getData(){
    this.loading = true;
    this.privateMessageService.getMessage(this.topicId,this.page)
    .subscribe({
      next: r => {
        this.privateMessage = r
        this.loading = false;
      },
      error: e => console.log(e),
    });
  }

  changePage(page: number) {
    this.page=page;
    this.getData()
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
