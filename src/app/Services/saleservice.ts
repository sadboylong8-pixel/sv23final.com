import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Saleservice {
  private url = 'http://localhost:5062/api/Sale/';
  constructor(private http: HttpClient){}

  Get(){
    return this.http.get<any[]>(this.url+'Get');
  }

  Create(sale: any){
    return this.http.post(this.url + 'Post', sale);
  }

  Delete(id: string){
    return this.http.delete<any[]>(this.url + id);
  }

  Update(id: string, sale: any){
    return this.http.put(this.url + id, sale);
  }
}
