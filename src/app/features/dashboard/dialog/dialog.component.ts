import { Component, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatList, MatListItem } from '@angular/material/list';
import { DashboardService } from '../service/dashboard.service';
import { DialogItem } from './dialog-item/dialog-item.component';

@Component({
  selector: 'DialogComponent',
  imports: [MatListItem, MatList, MatDialogClose, MatDialogContent, MatButton , DialogItem],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  title: string | undefined = 'Dialog';
  items = signal<any[]>([]);
  // isDialogOpen = false;
  constructor(private dashboardService: DashboardService) {
    console.log(dashboardService.isDialogOpen());
      this.title = dashboardService.isDialogOpen().title;
      this.items.set(dashboardService.isDialogOpen().items);
      console.log(this.items());
    // this.isDialogOpen = this.dashboardService.isDialogOpen();
  }
  onDialogCloseClick() {
    this.dashboardService.isDialogOpen.update((data) => {
      data.hidden = true;
      
      return data;
    });
  }
}
