import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './features/sidebar/sidebar.component';
import { SidebarService } from './features/sidebar/service/sidebar.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet , SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private sidebarService: SidebarService) {
    this.sidebarService.menuItems.set([
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Report', link: '/dashboard/report' },
      { title: 'Login', link: '/login' },
    ]);
  }
}
