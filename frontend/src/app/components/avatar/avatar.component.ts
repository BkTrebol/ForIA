import {
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit, OnChanges {
  public getAvatarUrl: string;
  public defaultUrl: string;
  public avatarUrl: string;
  public regexUrl: RegExp;

  @Input() user: {
    avatar: string | null;
    nick: string;
    isVerified?: boolean;
  };
  @Input() width: string;
  @Input() height: string;
  @Input() small: boolean;

  constructor() {
    this.getAvatarUrl = environment.api + 'user/get-avatar/';
    this.defaultUrl = "https://api.dicebear.com/6.x/bottts/svg?seed=";
    this.avatarUrl = '';
    this.regexUrl = /https?:\/\/.+\..+/;
    this.user = { avatar: null, nick: '', isVerified: true };
    this.width = '100';
    this.height = '100';
    this.small = false;
  }

  ngOnChanges(): void {
    this.getUrlImge();
  }

  ngOnInit(): void {
    this.getUrlImge();
  }

  getUrlImge(): void {
    if (this.user.avatar != null && this.user.avatar != '') {
      if (this.regexUrl.test(this.user.avatar)) {
        this.avatarUrl = this.user.avatar;
      } else {
        this.avatarUrl = this.getAvatarUrl + this.user.avatar;
      }
    } else {
      this.avatarUrl = this.defaultUrl + this.user.nick;
    }
  }
}
