import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from './producto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private baseURL = "http://localhost:8080/api/v1/empleados";

  constructor(private HttpClient: HttpClient) {}

  obtenerEmpleados():Observable<Producto[]> {
    return this.HttpClient.get<Producto[]>(`${this.baseURL}`);
  }

}
