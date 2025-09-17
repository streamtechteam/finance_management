import { DashboardService } from '../../service/dashboard.service';
import { Component, input, InputSignal, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatFormField, MatHint, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialAlertService } from '../../../alert/service/alert.service';
import {
  DataEditMode,
  DataType,
  EditDataType,
  Finance,
  Project,
  User,
} from '../../../../shared/data.types';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'EntityEdit',
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
    MatHint,
    MatDatepicker,
    MatDatepickerModule,
    MatIconButton,
  ],
  templateUrl: './entity-edit.component.html',
  styleUrl: './entity-edit.component.css',
})
export class EntityEditComponent {
  id: string | null | undefined;
  mode: string;
  type: string;
  fields: { name: string; label: string }[] = [];
  form!: FormGroup;
  hidePassword = signal(true);
  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private dashboardService: DashboardService,
    private alert: MaterialAlertService,
    private router: Router
  ) {
    this.mode = this.activeRoute.snapshot.paramMap.get('mode')!;
    this.type = this.activeRoute.snapshot.paramMap.get('type')!;
    title.setTitle(this.mode.at(0)?.toUpperCase() + this.mode.slice(1) + ' ' + this.type.at(0)?.toUpperCase() + this.type.slice(1, this.type.length -1));
    console.log(this.type);
    console.log(this.mode);
    switch (this.mode) {
      case 'edit':
        switch (this.type) {
          case 'users':
            this.form = new FormGroup({
              name: new FormControl('', [Validators.required, Validators.minLength(2)]),
              last_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
              phone: new FormControl('', [Validators.required, Validators.pattern('^[+]*[0-9]*$')]),
              password: new FormControl('', [Validators.required, Validators.minLength(6)]),
              role: new FormControl('', [Validators.required]),
            });
            this.fields = [
              { name: 'name', label: 'Name' },
              { name: 'last_name', label: 'Last Name' },
              { name: 'phone', label: 'Phone' },
              { name: 'password', label: 'Password' },
              { name: 'role', label: 'Role' },
            ];
            break;
          case 'projects':
            this.form = new FormGroup({
              name: new FormControl('', [Validators.required, Validators.minLength(2)]),
              description: new FormControl('', [Validators.required, Validators.minLength(2)]),
              budget: new FormControl('', [
                Validators.required,
                Validators.pattern('^[+]*[0-9]*$'),
              ]),
              owner: new FormControl('', [Validators.required, Validators.minLength(2)]),
            });
            this.fields = [
              { name: 'name', label: 'Name' },
              { name: 'description', label: 'Description' },
              { name: 'budget', label: 'Budget' },
              { name: 'owner', label: 'Owner' },
            ];

            break;
          case 'finances':
            this.form = new FormGroup({
              project_id: new FormControl('', [Validators.required, Validators.minLength(2)]),
              amount: new FormControl('', [Validators.required]),
              category: new FormControl('', [Validators.required]),
              date: new FormControl('', [Validators.required]),
            });
            this.fields = [
              { name: 'project_id', label: 'Project ID' },
              { name: 'amount', label: 'Amount' },
              { name: 'category', label: 'Category' },
              { name: 'date', label: 'Date' },
            ];
            break;
        }
        break;
      case 'add':
        switch (this.type) {
          case 'users':
            this.form = new FormGroup({
              name: new FormControl('', [Validators.required, Validators.minLength(2)]),
              last_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
              phone: new FormControl('', [Validators.required, Validators.pattern('^[+]*[0-9]*$')]),
              password: new FormControl('', [Validators.required, Validators.minLength(6)]),
              role: new FormControl('', [Validators.required, Validators.pattern('admin|user')]),
            });
            this.fields = [
              { name: 'name', label: 'Name' },
              { name: 'last_name', label: 'Last Name' },
              { name: 'phone', label: 'Phone' },
              { name: 'password', label: 'Password' },
              { name: 'role', label: 'Role' },
            ];
            break;
          case 'projects':
            this.form = new FormGroup({
              name: new FormControl('', [Validators.required, Validators.minLength(2)]),
              description: new FormControl('', [Validators.required, Validators.minLength(2)]),
              budget: new FormControl('', [
                Validators.required,
                Validators.pattern('^[+]*[0-9]*$'),
              ]),
              owner: new FormControl('', [Validators.required, Validators.minLength(2)]),
            });
            this.fields = [
              { name: 'name', label: 'Name' },
              { name: 'description', label: 'Description' },
              { name: 'budget', label: 'Budget' },
              { name: 'owner', label: 'Owner' },
            ];
            break;
          case 'finances':
            this.form = new FormGroup({
              project_id: new FormControl('', [Validators.required, Validators.minLength(2)]),
              amount: new FormControl(0,[Validators.required , Validators.pattern('^[0-9]*$')]),
              category: new FormControl('', [Validators.required]),
              date: new FormControl(new Date(), [Validators.required]),
            });
            this.fields = [
              { name: 'project_id', label: 'Project ID' },
              { name: 'amount', label: 'Amount' },
              { name: 'category', label: 'Category' },
              { name: 'date', label: 'Date' },
            ];
            break;
        }
        break;
    }

    activeRoute.paramMap.subscribe((params) => {
      if (params.get('id')) {
        this.id = params.get('id');
        this.dashboardService
          .dataRequestHandler({
            mode: 'get',
            type: this.type as DataType,
          })
          .then((res) => {
            console.log(res);
            if (res?.responese.data == null) {
              router.navigate(['/home']);
            }
            this.form.patchValue(
              res?.responese?.data.find((u: { id: string | null }) => u.id === params.get('id'))
            );
          });
      }
    });
  }

  showPasswordClick(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }
  onSubmit() {
    let data: Partial<User | Project | Finance> = {};
    for (let field of this.fields) {
      data[field.name as keyof typeof data] = this.form.get(field.name)?.value!;
    }
    let date = new Date((data as Finance).date);
    (data as Finance).date = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    console.log((data as Finance).date)

    if (this.mode === 'edit' && this.id) {
      data.id = this.id;
    }

    console.log(data);
    this.dashboardService
      .dataRequestHandler({
        mode: this.mode as any,
        type: this.type as DataType,
        data: data as User | Project | Finance,
      })
      .then((res) => {
        let successMessage;
        this.mode == 'edit'
          ? (successMessage = 'updated successfully')
          : (successMessage = 'added successfully');
        console.log(res);
        this.dashboardService.statusCodeHandler(res?.responese.status, console.log);
        this.alert.success(successMessage, 'Success').subscribe((res) => {
          if (res.isConfirmed) {
            this.router.navigate(['/dashboard/' + this.type]);
          }
        });
      });

  }
}
