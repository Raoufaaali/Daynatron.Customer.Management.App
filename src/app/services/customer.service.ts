import { HttpClient } from '@angular/common/http'; 
import { EventEmitter, Injectable, Output } from '@angular/core'; import { Observable } from 'rxjs';
import { Customer } from '../data/customer';

@Injectable({
    providedIn: 'root',
})

export class CustomerService {

    @Output() selectedCustUpdatedEvent = new EventEmitter<string>();
    
    baseUrl: string = 'https://localhost:7113/';

    constructor(private httpClient: HttpClient) { }

    addCustomer(data: any): Observable<any> {
        return this.httpClient.post(this.baseUrl + 'customers', data);
    }

    updateCustomer(id: number, data: any): Observable<any> {
        return this.httpClient.put(this.baseUrl + `customers/${id}`, data);
    }

    deleteCustomer(id: number): Observable<any> {
        return this.httpClient.delete(this.baseUrl +`customers/${id}`);
    }

    getAllCustomers(): Observable<any> {
        return this.httpClient.get(this.baseUrl + 'customers');
    }

    saveLastSelectedCustomer(customer: Customer)
    {
      const customerAsString = JSON.stringify(customer);   
      sessionStorage.setItem('lastSelectedCustomer', customerAsString);
      this.selectedCustUpdatedEvent.emit(customerAsString);
    }

    loadLastSelectedCustomer(): Customer
    {
      let cust: Customer = JSON.parse(localStorage.getItem('lastSelectedCustomer') || '{}');
      return cust;
    }

    clearLastSelectedCustomer(customer: Customer)
    {
        sessionStorage.removeItem('lastSelectedCustomer')
    }
}