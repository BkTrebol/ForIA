import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Global } from 'src/environment/global';

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

  @Input('user') user: {
    avatar: string | null;
    nick: string;
    isVerified?: boolean;
  };
  @Input('width') width: string;
  @Input('height') height: string;
  @Input('small') small: boolean;

  constructor() {
    this.getAvatarUrl = Global.api + 'user/get-avatar/';
    this.defaultUrl = 'https://api.dicebear.com/6.x/bottts/svg?seed=';
    this.avatarUrl = '';
    this.regexUrl = /https?:\/\/.+\..+/;
    this.user = { avatar: null, nick: '', isVerified: true };
    this.width = '100';
    this.height = '100';
    this.small = false;
  }

  ngOnChanges(_: SimpleChanges): void {
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
