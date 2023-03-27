import { Component, OnInit } from '@angular/core';
import { UserPreferences } from '../../../models/user-preferences';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../../styles/card.scss'],
})
export class ProfileComponent implements OnInit{
  public user: User;
  public preferences: UserPreferences;

  constructor(private _authService: AuthService, private userSerivce: UserService) {
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
    this.user = this._authService.userData;
    this.preferences = this.userSerivce.userPreferences;
  }
}
