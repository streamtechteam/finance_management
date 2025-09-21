import { DashboardService } from './service/dashboard.service';
import { Component, effect } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'RootDashboardComponent',
  imports: [RouterOutlet, SidebarComponent, MatToolbar, MatIcon, MatIconButton],
  templateUrl: './root-dashboard.component.html',
  styleUrl: './root-dashboard.component.css',
})
export class RootDashboardComponent {
  private subscription: Subscription = new Subscription();
  constructor(private dashboardService: DashboardService, private router: Router) {}
  ngOnInit() {
    try {
      this.dashboardService.dataRequestHandler({ mode: 'get', type: 'me' }).then((res) => {});
      // Your logic here
    } catch (e) {
      console.log(e);
      this.router.navigate(['/home']);
    }
  }
}
