import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url = 'http://localhost:5062/api/Product/';
  constructor(private http: HttpClient){}

  GetProduct(): Observable<any[]>{
    return this.http.get<any[]>(this.url+'Get');
  }

  CreateProduct(product: any){
    return this.http.post(this.url + 'Post', product);
  }

  DeleteProduct(id: string): Observable<any[]>{
    return this.http.delete<any[]>(this.url + id);
  }

  UpdateProduct(id: string, product: any){
    return this.http.put(this.url + id, product);
  }
}
