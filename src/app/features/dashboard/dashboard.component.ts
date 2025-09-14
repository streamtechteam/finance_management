import { Component, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from './service/dashboard.service';
import { DataEditMode, Project, User } from '../../shared/data.types';
import { MatButton, MatFabButton } from '@angular/material/button';
import { DialogComponent } from "./dialog/dialog.component";
// import { AppRoutingModule } from "../../app-routing.module";

@Component({
  selector: 'DashboardComponent',
  imports: [RouterLink, MatButton, MatFabButton, DialogComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  isAdmin = false; // Placeholder: set to true for admin, false for non-admin
  canEditUsers = false; // Placeholder: allow editing users
  canEditFinance = false;
  canEditProjects = false; // Placeholder: allow editing finance
  isDialogOpen = computed(() => this.dashboardService.isDialogOpen());
  constructor(
    private router: Router,
    private dashboardService: DashboardService,
  ) {
    dashboardService.dataRequestHandler({ mode: 'get', type: 'me' }).then((res) => {
      let user = res?.responese as User;
      console.log(user.role);
      this.isAdmin = user.role === 'admin';
      this.canEditUsers = user.role === 'admin';
      this.canEditFinance = user.role === 'admin';
      this.canEditProjects = user.role === 'admin';
      console.log(this.isAdmin);
    });
  }
  onEditData(mode: DataEditMode) {
    this.dashboardService.dataRequestHandler(mode).then((res) => {
      console.log(res);
      this.dashboardService.statusCodeHandler(res?.responese.status, alert);
      this.dashboardService.openDialog({
        title: res?.title!.at(0)?.toUpperCase()! + res?.title!.slice(1 , res?.title?.length), 
        items: res?.responese.data,
        icon: 'success',
        confirmButtonText: 'OK',
      })
      // this.dashboardService.isDialogOpen.update((data) => {
      //   data.hidden = false;
      //   data.title = res?.title!.at(0)?.toUpperCase()! + res?.title!.slice(1 , res?.title?.length); 
      //   data.items = res?.responese.data;
      //   // console.log(res?.responese.data)
      //   return data;
      // });
    });
  }

}
