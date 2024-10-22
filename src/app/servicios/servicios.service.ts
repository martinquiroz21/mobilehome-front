import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from './servicio';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  private baseURL = "http://localhost:8080/api-backend/servicios";

  constructor(private HttpClient: HttpClient) {}

  obtenerServicios():Observable<Servicio[]> {
    return this.HttpClient.get<Servicio[]>(`${this.baseURL}`);
  }

  obtenerServicioPorId(id:number): Observable<Servicio> {
    return this.HttpClient.get<Servicio>(`${this.baseURL}/${id}`);
  }

}
