
import { Component, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from './service/dashboard.service';
import { DataEditMode, Finance, Project, User } from '../../shared/data.types';
import { MatButton, MatFabButton } from '@angular/material/button';
import { DialogComponent } from "./dialog/dialog.component";
import { SidebarService } from '../sidebar/service/sidebar.service';
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
  canEditProjects = false;
  projects : Project[] = []
  users : User[] = []
  finances : Finance[] = []
  // Placeholder: allow editing finance
  isDialogOpen = computed(() => this.dashboardService.isDialogOpen());
  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private sidebarService: SidebarService,
  ) {
    this.sidebarService.menuItems.set([
      // {title: 'Dashboard', link: '/dashboard'},
      {title: 'Home', link: '/'},
      {title: 'View Users', link: '/dashboard/users'},
      {title: 'View Projects', link: '/dashboard/projects'},
      {title: 'View Finances', link: '/dashboard/finances'},
    ])
    try{
    dashboardService.dataRequestHandler({ mode: 'get', type: 'me' }).then((res) => {
      if ( res?.responese == null ){
        router.navigate(['/home']);
      }
      let user = res?.responese as User;
      console.log(user.role);
      this.isAdmin = user.role === 'admin';
      this.canEditUsers = user.role === 'admin';
      this.canEditFinance = user.role === 'admin';
      this.canEditProjects = user.role === 'admin';
      console.log(this.isAdmin);
    });
    dashboardService.dataRequestHandler({ mode: 'get', type: 'projects' }).then((res) => {
      console.log(res);
      this.projects = res?.responese.data;
    });
    dashboardService.dataRequestHandler({ mode: 'get', type: 'users' }).then((res) => {
      console.log(res);
      this.users = res?.responese.data;
    });
    dashboardService.dataRequestHandler({ mode: 'get', type: 'finances' }).then((res) => {
      console.log(res);
      this.finances = res?.responese.data;
    });
    }catch(e){
      console.log(e);
    }

  }
  onEditData(mode: DataEditMode) {
    this.dashboardService.dataRequestHandler(mode).then((res) => {
      console.log(res);
      this.dashboardService.statusCodeHandler(res?.responese.status, console.log);
      this.router.navigate(['/dashboard/' + mode.type]);
      // this.dashboardService.openDialog({
      //   title: res?.title!.at(0)?.toUpperCase()! + res?.title!.slice(1 , res?.title?.length), 
      //   items: res?.responese.data,
      //   icon: 'success',
      //   confirmButtonText: 'OK',
      // })
    });
  }
  onGenerateReport(){
    this.router.navigate(['/dashboard/report']);
  }
}
