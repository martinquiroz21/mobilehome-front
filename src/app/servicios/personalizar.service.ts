import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Estilo } from './estilo';
import { Adicional } from './adicional';
import { Usuario } from './usuario';
import { Producto } from './producto';

@Injectable({
  providedIn: 'root'
})
export class PersonalizarService {

  private baseURL = "http://localhost:8080/api-backend/personalizar";

  constructor(private HttpClient: HttpClient) { }

  obtenerEstilos(): Observable<Estilo[]> {
    return this.HttpClient.get<Estilo[]>(`${this.baseURL}/estilos`);
  }

  obtenerAdicionales(): Observable<Adicional[]> {
    return this.HttpClient.get<Adicional[]>(`${this.baseURL}/adicionales`);
  }

  registrarCompra(producto:Producto, usuario:Usuario, adicionales:Adicional[]): Observable<Producto> {
    const payload = { usuario, producto, adicionales};
    return this.HttpClient.post<Producto>(`${this.baseURL}/compra`, payload);
  }

}
