import { DashboardService } from './../../service/dashboard.service';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  imports: [
    MatFormField,
    MatIcon,
    MatLabel,
    MatButton,
    ReactiveFormsModule,
    MatInput,
    MatSuffix,
    MatSelect,
    MatOption,
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent {
  userId: string | null | undefined;
  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    last_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[+]*[0-9]*$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    role: new FormControl('', [Validators.required, Validators.pattern('admin|user')]),
  });
  constructor(
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private dashboardService: DashboardService,
    private router: Router
  ) {
    activeRoute.paramMap.subscribe((params) => {
      this.userId = params.get('id');
      // console.log(params.get('id'));
      this.dashboardService
        .dataRequestHandler({
          mode: 'get',
          type: 'users',
        })
        .then((res) => {
          console.log(res);
          if (res?.responese.data == null) {
            router.navigate(['/home']);
          }
          this.userForm.patchValue(
            res?.responese?.data.find((u: { id: string | null }) => u.id === params.get('id'))
          );
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

  onSubmit() {
    this.dashboardService.dataRequestHandler({
      mode:"edit",
      data:{
        type: 'users',
        
      }
    })
    // console.log('test');
  }
}
