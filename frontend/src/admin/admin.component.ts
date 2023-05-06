import { Component, OnInit } from '@angular/core';
import { AuthService } from './modules/auth/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {

  constructor(
    private _authService: AuthService
  ){

  }
  ngOnInit(): void {
    this._authService.autoAuthUser();
  }
}
