import { Component } from '@angular/core';
import { DashboardService } from '../dashboard/service/dashboard.service';
import { Router } from '@angular/router';
import { MaterialAlertService } from '../alert/service/alert.service';

@Component({
  selector: 'app-report',
  imports: [],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent {
  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private alert: MaterialAlertService
  ) {
    this.dashboardService
      .dataRequestHandler({ mode: 'get', type: 'me' })
      .then((res) => {
        if (res?.responese == null) {
          this.alert.error('You are not logged in', 'Login').subscribe((res) => {
            if (res.isConfirmed) {
              this.router.navigate(['/login']);
            }
          });
        }
      })
      .catch((err) => {
        this.alert.error('You are not logged in', 'Login').subscribe((res) => {
          if (res.isConfirmed) {
            this.router.navigate(['/login']);
          }
        });
      });

    
  }
}
