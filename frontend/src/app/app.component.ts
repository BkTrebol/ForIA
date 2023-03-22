import { Component, OnInit } from '@angular/core';
// import { CssService } from './services/css.service';
// import { UserService } from './services/user.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './components/styles/general.scss'],
})
export class AppComponent implements OnInit {
  auth: boolean;
  top: boolean = false;
  canSmall: boolean = false;

  constructor(private router: Router) {
    this.auth = true; //serivce
  }

  ngOnInit() {
    // For changing the nav height
    this.small();
    // Only in some pages
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (['/login', '/register', '/edit'].includes(event.url)) {
          console.log(event.url);
          this.canSmall = false;
        } else {
          this.canSmall = true;
        }
      }
    });
  }

  // For changing the nav height on scroll
  small() {
    window.onscroll = () => {
      if (
        // document.body.scrollTop > 100 ||
        // document.documentElement.scrollTop > 100 ||
        // window.scrollY > 100 ||
        window.pageYOffset > 0 &&
        this.canSmall
      ) {
        this.top = true;
      } else {
        this.top = false;
      }
    };
  }

  //Logout
  logout() {
    console.log("Logout (app.component)");
    
  }
}
