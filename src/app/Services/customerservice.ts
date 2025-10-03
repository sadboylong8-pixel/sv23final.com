import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private url = 'http://localhost:5062/api/Customer/';
  constructor(private http: HttpClient){}

  Get(){
    return this.http.get<any[]>(this.url+'Get');
  }

  Create(customer: any){
    return this.http.post(this.url + 'Post', customer);
  }

  Delete(id: string){
    return this.http.delete<any[]>(this.url + id);
  }

  Update(id: string, customer: any){
    return this.http.put(this.url + id, customer);
  }
}
