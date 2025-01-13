import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from './State/inventory.model';


@Injectable({
  providedIn: 'root'
})
export class APIService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }
  //Login API
  addData (data:any){
    return this.http.post(`${this.baseUrl}/LoginData`,data);
  }
  getData (){
    return this.http.get(`${this.baseUrl}/LoginData`)
  }

 //Full Product Information API
  getProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(`${this.baseUrl}/ProductsInfo`);
  }
  Create(data: Products) {
    return this.http.post(`${this.baseUrl}/ProductsInfo`, data);
  }
  Update(id: number,data: Products) {
    return this.http.put(`${this.baseUrl}/ProductsInfo/${id}`, data);
  }
  Delete(id: number) {
    return this.http.delete(`${this.baseUrl}/ProductsInfo/${id}`);
  }

   //Brand API
  AddBrand(brand:string) {
    return this.http.post(`${this.baseUrl}/Brand`, brand);
  }
  GetBrand(): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/Brand`);
  }
  DeleteBrand(id:number){
    return this.http.delete(`${this.baseUrl}/Brand/${id}`);
  }

   //Product API
  AddProduct(brand:string) {
    return this.http.post(`${this.baseUrl}/Product`, brand);
  }
  GetProduct(): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/Product`);
  }
  DeleteProduct(id:number){
    return this.http.delete(`${this.baseUrl}/Product/${id}`);
  }

   //Order API
  GetOrderedData(): Observable<any []>{
    return this.http.get<any[]>(`${this.baseUrl}/OrderedInfo`);
  }
  addOrderedData(data:[]){
    return this.http.post(`${this.baseUrl}/OrderedInfo`,data);
  }
  deleteOredr(id:any){
    return this.http.delete(`${this.baseUrl}/OrderedInfo/${id}`);
  }
}