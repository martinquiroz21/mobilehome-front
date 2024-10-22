import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Servicio } from '../../servicios/servicio';
import { ServiciosService } from '../../servicios/servicios.service';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicio-detalle',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './servicio-detalle.component.html',
  styleUrl: './servicio-detalle.component.css'
})
export class ServicioDetalleComponent implements OnInit {

  @ViewChild('botonCerrar')cerrarModal!:ElementRef;
  id: number;
  servicio: Servicio;
  mensaje: String;
  formServicio: FormGroup;

  constructor(private router: ActivatedRoute, private route: Router, private renderer:Renderer2, private servicioService: ServiciosService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.id = this.router.snapshot.params['id'];
    this.servicio = new Servicio();
      this.servicioService.obtenerServicioPorId(this.id).subscribe(dato => {
        this.servicio = dato;
      });
    this.validarMsjForm();
  }

  validarMsjForm() {
    this.formServicio = this.formBuilder.group({
      mensajeServ: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.formServicio.valid) {
      console.log('Formulario válido:', this.formServicio.value);
      var botonModal = this.cerrarModal.nativeElement;
      this.renderer.
      this.route.navigate(['/servicios']);
    } else {
      console.log('Formulario inválido');
    }
  }

}
