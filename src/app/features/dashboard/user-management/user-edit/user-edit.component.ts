import { DashboardService } from './../../service/dashboard.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-user-edit',
  imports: [MatFormField, MatIcon, MatLabel, MatButton, ReactiveFormsModule, MatInput , MatSuffix] ,
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent {
  userForm = new FormGroup({
    name: new FormControl('' , [Validators.required , Validators.minLength(2)]),
    last_name: new FormControl('' , [Validators.required , Validators.minLength(2)]), 
    phone: new FormControl('' , [Validators.required , Validators.pattern('^[0-9]*$')]),
    password: new FormControl('' , [Validators.required , Validators.minLength(6)]),
    role: new FormControl('' , [Validators.required , Validators.pattern("admin|user")]),
  });
  constructor(private formBuilder: FormBuilder , private router: ActivatedRoute , private dashboardService: DashboardService) {

    router.paramMap.subscribe(params => {
      // console.log(params.get('id'));
      this.dashboardService.dataRequestHandler({
        mode: 'get',
        type: "users",
      }).then((res) => {
        console.log(res);
        this.userForm.patchValue(res?.responese?.users.find((u: { id: string | null; }) => u.id === params.get('id')));
      });
      
    });
    // console.log();

    // this.userForm = this.formBuilder.group({
    //   name: ['', Validators.required],
    //   last_name: ['', Validators.required],
    //   phone: ['', Validators.required],
    //   password: ['', Validators.required],
    //   role: ['', Validators.required],
    // });


  }

  onSubmit(){
    console.log("test")
  }
}
