import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../servicios/producto';
import { ProductosService } from '../../servicios/productos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Adicional } from '../../servicios/adicional';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SessionService } from '../../servicios/session.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../servicios/usuario';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './producto-detalle.component.html',
  styleUrl: './producto-detalle.component.css'
})
export class ProductoDetalleComponent implements OnInit {

  id: number;
  producto: Producto;
  datosEstilo: any = {};
  adicionales: Adicional[];
  formCompra: FormGroup;
  productoYaComprado: boolean | undefined;

  constructor(private router: ActivatedRoute, private route: Router, private productoService: ProductosService, private sessionService: SessionService, private formBuilder: FormBuilder) {
    this.id = this.router.snapshot.params['id'];
    this.producto = new Producto();
  }

  ngOnInit(): void {
    this.productoService.obtenerProductoPorId(this.id).subscribe(dato => {
      this.producto = dato;
      this.datosEstilo = {titulo: this.producto.estilo.titulo};
    });
    this.productoService.obtenerAdicionalesDeUnProductoPorID(this.id).subscribe(datos => {
      this.adicionales = datos;
    });
    this.validarCompraForm();
  }

  validarCompraForm() {
    this.formCompra = this.formBuilder.group({
      nroTrj: ['', [Validators.required, Validators.pattern(/^\d{6,6}$/)]],
      cv: ['', [Validators.required, Validators.pattern(/^\d{3,3}$/)]]
    });
  }
  
  comprar() {
    if (this.formCompra.valid) {
      let usuario: Usuario = this.sessionService.getSession('user');
      this.productoService.registrarCompra(this.producto, usuario).subscribe({
        next: (response) => {
          this.productoYaComprado = response;
          this.mostrarMsjCompra();
        },
        error: (err) => {
          console.error('Error al obtener el estado:', err);
        }
      });
    }
    else {
      console.log("Error en la compra");
    }
  }

  mostrarMsjCompra() {
    if (this.productoYaComprado == false) {
      this.route.navigate(['/productos']);
      this.formCompra.reset();
      Swal.fire('Compra realizada con éxito!', `Has comprado un ${this.producto.titulo} a un precio total de $${this.producto.precio}`, `success`);
    }
    else {
      this.formCompra.reset();
      Swal.fire('El producto ya fue comprado!', `Compra algun producto que no hayas comprado antes.`, `error`);
    }
  }

  estaElUsuarioLogueado(): boolean {
    return this.sessionService.estaLogueado();
  }

  errorLogin() {
    Swal.fire('El usuario no esta logueado!', `Para poder realizar una compra primero debes iniciar sesión.`, `error`);
  }

}
