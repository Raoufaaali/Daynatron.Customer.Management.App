

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from './services/customer.service';
import { Customer } from './data/customer';
import { CustomerAddEditComponent } from './components/cust-add-edit/cust-add-edit.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  title: string = 'Daynatron.Customer.Management.App';
  lastSelectedCustomer: string = `Nothing has been selected yet`;

  // the columns that will be displayed in the customer details table
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'createdDate',
    'updatedDate',
    'action',
  ];
 
  // Customers list will be assigned to this and it is passed as the data source to the mat-table in the HTML template 
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  // dependency injection
  constructor(
    private dialog: MatDialog,
    private custService: CustomerService,
  ) {}

  ngOnInit(): void {
    this.getCustomerList();
    this.custService.selectedCustUpdatedEvent
    .subscribe((data:string) => {
      this.lastSelectedCustomer = data;
      console.log('Event message from CustomerService: ' + data);
    });
  }

  openAddEditCustomerDialog() {
    const dialogRef = this.dialog.open(CustomerAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCustomerList();
        }
      },
    });
  }

  getCustomerList() {
    this.custService.getAllCustomers().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
       // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  // for searching customers with firstname, lastname, email, etc
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteCustomer(id: number) {
    let confirm = window.confirm("Are you sure you want to delete this customer?");
    if(confirm) {
      this.custService.deleteCustomer(id).subscribe({
        next: (res) => {
          alert('Customer deleted!');
          this.getCustomerList();
        },
        error: (err) => {
          console.log(err);
          alert(err.error.message);
        },
      });
    }
  }

  openEditForm(data: any) {
    const dialogRef = this.dialog.open(CustomerAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCustomerList();
        }
      }
    });
  }

  saveSelectedCustomerInSessionStorage(data: any) {
    let cust = {} as Customer;
    cust.id = data.id;
    cust.firstName = data.firstName;
    cust.lastName = data.lastName;
    cust.createdDate = data.createdDate;
    cust.updatedDate = data.updatedDate;
    console.log(cust);
    this.custService.saveLastSelectedCustomer(cust);
  }


}