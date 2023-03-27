import { Component, OnInit } from '@angular/core';
import { UserPreferences } from 'src/app/models/user-preferences';
import { User } from 'src/app/models/user';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit{
  public user: User;
  public preferences: UserPreferences;

  constructor( private userSerivce: UserService) {
    this.user = {
      id: 0,
      nick: '',
      email: '',
      location: '',
      birthday: '',
      avatar: '',
      roles: [],
      created_at: '',
      updated_at: '',
    };
    this.preferences = {
      id_user:0,
      sidebar:true,
      filter_bad_words:false,
      allow_view_profile:true,
      allow_users_to_mp:true,
      hide_online_presence:false,
      two_fa:false,
      allow_music:false,
    }
  }

  ngOnInit(): void {
    // this.user = this._authService.userData;
    this.preferences = this.userSerivce.userPreferences;
  }
}
