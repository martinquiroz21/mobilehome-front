import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductosService } from '../../servicios/productos.service';
import { Producto } from '../../servicios/producto';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {

  productos:Producto[];
  numeroResultados:number;
  nombreFiltro:string;

  constructor(private productoService:ProductosService) {
    this.obtenerListaDeProductos();
  }

  obtenerListaDeProductos() {
    this.nombreFiltro = "Todos los productos";
    this.productoService.obtenerProductos().subscribe(datos => {
      this.productos = datos;
      this.numeroResultados = this.productos.length;
    });
  }

  obtenerProductosPorCategoria(categoria:string) {
    this.nombreFiltro = categoria + "s";
    this.productoService.obtenerProductosPorCategoria(categoria).subscribe(datos => {
      this.productos = datos;
      this.numeroResultados = this.productos.length;
    });
  }

}
