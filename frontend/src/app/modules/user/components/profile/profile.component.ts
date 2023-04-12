import { Component, OnInit } from '@angular/core';
import { UserPreferences } from 'src/app/models/user-preferences';
import { User } from 'src/app/models/user';
import { UserService } from '../../service/user.service';
import { UserProfile } from 'src/app/models/receive/user-profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../../../../styles/card.scss'],
})
export class ProfileComponent implements OnInit {
  public user: UserProfile;
  public preferences: UserPreferences;

  constructor(private userSerivce: UserService) {
    this.user = {
      nick: '',
      email: '',
      location: '',
      birthday: '',
      avatar: '',
      role: '',
      created_at: '',
      updated_at: '',
    };
    this.preferences = {
      sidebar: true,
      filter_bad_words: false,
      allow_view_profile: true,
      allow_users_to_mp: true, //si
      hide_online_presence: false,
      two_fa: false,
      allow_music: false,
    };
  }

  ngOnInit(): void {
    //enviar tot junt
    // this.userSerivce.getPreferences().subscribe({
    //   next: (res) => {
    //     // this.preferences = res.preferences;
    //   },
    // });
    this.userSerivce.getEdit().subscribe({
      next: (res) => {
        this.user = res.user;
      },
    });
  }
}
