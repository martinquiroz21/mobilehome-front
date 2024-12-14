import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from './usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private baseURL = "http://localhost:8080/api-backend/usuarios";

  constructor(private HttpClient: HttpClient) {}

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.HttpClient.get<Usuario[]>(`${this.baseURL}`);
  }

  registrarUsuario(usuario:Usuario): Observable<Usuario> {
    return this.HttpClient.post<Usuario>(`${this.baseURL}/registro`, usuario);
  }
  
}
