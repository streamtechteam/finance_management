
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../sidebar/service/sidebar.service';
@Component({
  selector: 'HomeComponent',
  imports: [MatButton, RouterLink ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private sidebarService: SidebarService) {
    this.sidebarService.menuItems.set([
      // {title: 'Dashboard', link: '/dashboard'},

      {title: 'Login', link: '/login'},
    ])
  }
}
