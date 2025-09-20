import { DashboardService } from '../service/dashboard.service';
import { Component } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatList } from '@angular/material/list';
import { MatCard } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataType, Finance, Project, User } from '../../../shared/data.types';
import { MaterialAlertService } from '../../alert/service/alert.service';
import { Title } from '@angular/platform-browser';
import { SidebarService } from '../../sidebar/service/sidebar.service';

@Component({
  selector: 'EntityManagementComponent',
  imports: [MatButton, MatIcon, MatList, MatCard, MatIconButton, RouterLink],
  templateUrl: './entity-management.component.html',
  styleUrl: './entity-management.component.css',
})
export class EntityManagementComponent {
  // entities: User[] | Project[] | Finance[] = [];
  fields: { name: string; label: string }[] = [];
  type!: string;
  entities: any[] = [];
  // items : any[]  = [];
  
  constructor(
    private dashboardService: DashboardService,
    private alert: MaterialAlertService,
    private sidebarService: SidebarService,
    private route: ActivatedRoute,
    private title: Title
  ) {
    this.sidebarService.menuItems.set([
      {title: 'Dashboard', link: '/dashboard'},
      {title: 'View Users', link: '/dashboard/users'},
      {title: 'View Projects', link: '/dashboard/projects'},
      {title: 'View Finances', link: '/dashboard/finances'},
    ])
    this.route.paramMap.subscribe((params) => {
      this.type = params.get('type')!;
      title.setTitle(this.type.at(0)?.toUpperCase() + this.type.slice(1, this.type.length -1) + ' Management');
          switch (this.type) {
            case 'users':
              this.entities = this.entities as User[];
              this.fields = [
                { name: 'name', label: 'Name' },
                { name: 'last_name', label: 'Last Name' },
                { name: 'phone', label: 'Phone' },
                { name: 'role', label: 'Role' },
              ];
              break;
            case 'projects':
              this.entities = this.entities as Project[];
              this.fields = [
                { name: 'name', label: 'Name' },
                { name: 'description', label: 'Description' },
                { name: 'budget', label: 'Budget' },
                { name: 'owner', label: 'Owner' },
              ];
              break;
            case 'finances':
              this.entities = this.entities as Finance[];
              this.fields = [
                { name: 'project_id', label: 'Project ID' },
                { name: 'amount', label: 'Amount' },
                { name: 'category', label: 'Category' },
                { name: 'date', label: 'Date' },
              ];
              break;
          }

          this.getData();
    })
    // this.type = this.route.snapshot.paramMap.get('type')!;
    // title.setTitle(this.type.at(0)?.toUpperCase() + this.type.slice(1, this.type.length -1) + ' Management');


  }
  getData() {
    this.dashboardService
      .dataRequestHandler({ mode: 'get', type: this.type as DataType })
      .then((res) => {
        console.log(res);
        this.entities = res?.responese.data;
        // for (let entity of this.entities){
        //     for (let field of this.fields){
        //         this.items.push(entity[field.name]);
        //         // entity[field.name] = res?.responese.data.find((u: { id: string | null }) => u.id === entity.id)[field.name];
        //     }
        // }
        // console.log(this.entities)
        // console.log(this.items);
        // this.entities = res?.responese.data;
      });
  }
  onDeleteClick(id: string) {
    this.dashboardService
      .dataRequestHandler({
        mode: 'delete',
        type: this.type as DataType,
        id: id,
      })
      .then((res) => {
        console.log(res);
        this.dashboardService.statusCodeHandler(res?.responese.status, console.log);
        this.alert.success('deleted successfully', 'Success').subscribe((res) => {
          this.getData();
        });
      });
  }
}
