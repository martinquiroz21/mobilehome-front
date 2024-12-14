import { ProductosService } from './../../servicios/productos.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { SessionService } from '../../servicios/session.service';
import Swal from 'sweetalert2';
import { Producto } from '../../servicios/producto';
import { Usuario } from '../../servicios/usuario';

@Component({
  selector: 'app-mis-motorhomes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-motorhomes.component.html',
  styleUrl: './mis-motorhomes.component.css'
})
export class MisMotorhomesComponent implements OnInit {

  productosUsuario:any[];
  usuario:Usuario;

  constructor(private router: Router, private sessionService: SessionService, private productoService:ProductosService) {}

  ngOnInit(): void {
    if (this.estaElUsuarioLogueado() != false) {
      this.usuario = this.sessionService.getSession('user');
      this.productoService.obtenerProductosDeUsuario(this.usuario.id).subscribe(datos => {
        this.productosUsuario = datos;
      });
    }
    else {
      this.router.navigate(['/home']);
      Swal.fire('El usuario no esta logueado!', `Para poder ingresar a esta seccion debes loguearte.`, `error`);
    }
  }

  estaElUsuarioLogueado(): boolean {
    return this.sessionService.estaLogueado();
  }

}
