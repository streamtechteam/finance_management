import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './features/sidebar/sidebar.component';
import { SidebarService } from './features/sidebar/service/sidebar.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet , SidebarComponent , MatToolbar , MatIcon , MatIconButton],
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
