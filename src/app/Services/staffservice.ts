import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Staffservice {
  private url = 'http://localhost:5062/api/Staff/';
  constructor(private http: HttpClient){}

  Get(){
    return this.http.get<any[]>(this.url+'Get');
  }

  Create(staff: any){
    return this.http.post(this.url + 'Post', staff);
  }

  Delete(id: string){
    return this.http.delete<any[]>(this.url + id);
  }

  Update(id: string, staff: any){
    return this.http.put(this.url + id, staff);
  }
}
