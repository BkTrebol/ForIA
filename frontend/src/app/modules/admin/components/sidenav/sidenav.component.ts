import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  public collapsed:boolean;
  constructor() {
    this.collapsed = false;
  }

  ngOnInit() {
    this.collapsed =  window.innerWidth <=800;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.collapsed = event.target.innerWidth <=800;
  }
}
