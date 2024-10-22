import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiciosService } from '../../servicios/servicios.service';
import { Servicio } from '../../servicios/servicio';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {

  servicios:Servicio[];

  constructor(private servicioService:ServiciosService) {
    this.obtenerListaDeServicios();
  }

  obtenerListaDeServicios() {
    this.servicioService.obtenerServicios().subscribe(datos => {
      this.servicios = datos;
    });
  }

}
