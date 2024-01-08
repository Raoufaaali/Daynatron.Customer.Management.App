import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-cust-add-edit',
  templateUrl: './cust-add-edit.component.html',
  styleUrls: ['./cust-add-edit.component.css']
})
export class CustomerAddEditComponent  implements OnInit {

  custForm: FormGroup;

  education: string[] = [
    'Matric',
    'Diploma',
    'Intermediate',
    'Graduate',
    'Post Graduate',
  ];

  constructor(
    private custService: CustomerService,
    private dialogRef: MatDialogRef<CustomerAddEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.custForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.custForm.patchValue(this.data);
  }

  onSubmit() {
    if (this.custForm.valid) {
      if (this.data) {
        this.custService
          .updateCustomer(this.data.id, this.custForm.value)
          .subscribe({
            next: (val: any) => {
              alert('Customer details updated!');
              this.dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
              alert("Error while updating the customer!");
            },
          });
      } else {
        this.custService.addCustomer(this.custForm.value).subscribe({
          next: (val: any) => {
            alert('Customer added successfully!');
            this.custForm.reset();
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
            alert("Error while adding the customer!");
          },
        });
      }
    }
  }

}
