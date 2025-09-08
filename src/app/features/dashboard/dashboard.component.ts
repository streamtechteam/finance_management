import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from './service/dashboard.service';
import { DataEditMode, Project, User } from '../../core/data.types';
// import { AppRoutingModule } from "../../app-routing.module";

@Component({
  selector: 'DashboardComponent',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})

export class DashboardComponent {
  isAdmin = false; // Placeholder: set to true for admin, false for non-admin
  canEditUsers = false; // Placeholder: allow editing users
  canEditFinance = false;
  canEditProjects = false; // Placeholder: allow editing finance

  constructor(private router: Router , private dashboardService: DashboardService) {
    dashboardService.editData({mode: 'get', type: 'me'}).then(res => {
      let user = res as User;
      console.log(user.role);
      this.isAdmin = user.role === 'admin';
      this.canEditUsers = user.role === 'admin';
      this.canEditFinance = user.role === 'admin';
      this.canEditProjects = user.role === 'admin';
      console.log(this.isAdmin);
    })
    // Example: set admin status (replace with real auth logic)
    // this.isAdmin = checkIfUserIsAdmin();
  }
  onEditData(mode: DataEditMode) {
    this.dashboardService.editData(mode).then(res => {
      console.log(res);
    })
  }

}
