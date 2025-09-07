import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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

  constructor(private router: Router) {
    // Example: set admin status (replace with real auth logic)
    // this.isAdmin = checkIfUserIsAdmin();
  }
}
