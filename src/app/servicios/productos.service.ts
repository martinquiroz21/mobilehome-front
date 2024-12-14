import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from './producto';
import { HttpClient } from '@angular/common/http';
import { Adicional } from './adicional';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private baseURL = "http://localhost:8080/api-backend/productos";

  constructor(private HttpClient: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    return this.HttpClient.get<Producto[]>(`${this.baseURL}`);
  }

  obtenerProductosPorCategoria(categoria:string): Observable<Producto[]> {
    return this.HttpClient.get<Producto[]>(`${this.baseURL}/${categoria}`);
  }

  obtenerProductoPorId(id:number): Observable<Producto> {
    return this.HttpClient.get<Producto>(`${this.baseURL}/producto-detalle/${id}`);
  }

  obtenerAdicionalesDeUnProductoPorID(id:number): Observable<Adicional[]> {
    return this.HttpClient.get<Adicional[]>(`${this.baseURL}/producto-adicional/${id}`);
  }

  registrarCompra(producto: Producto, usuario: Usuario): Observable<boolean> {
    const payload = { usuario, producto};
    return this.HttpClient.post<boolean>(`${this.baseURL}/producto-detalle/compra`, payload);
  }

  obtenerProductosDeUsuario(id:number): Observable<any[]> {
    return this.HttpClient.get<any[]>(`${this.baseURL}/productos-usuario/${id}`);
  }

}
