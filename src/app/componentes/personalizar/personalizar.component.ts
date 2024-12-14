import { Component, OnInit, Renderer2, ElementRef, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PersonalizarService } from './../../servicios/personalizar.service';
import { Estilo } from '../../servicios/estilo';
import { Adicional } from '../../servicios/adicional';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../servicios/session.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../servicios/usuario';
import { Producto } from '../../servicios/producto';

@Component({
  selector: 'app-personalizar',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './personalizar.component.html',
  styleUrl: './personalizar.component.css'
})
export class PersonalizarComponent implements OnInit {

  estilos:Estilo[];
  adicionales:Adicional[];
  idEstilo: number;
  estiloSeleccionado:Estilo;
  idPaleta:number;
  paletaSeleccionada:string;
  adicionalesSelec:Adicional[];
  total:number;
  tituloPers:string;
  precioMotorhome:number;
  precioPaleta:number;
  formCompra: FormGroup;
  @ViewChild('estiloAnimado') estiloAnimado!: ElementRef;
  @ViewChildren('cuadrosEstilos') cuadrosEstilos!: QueryList<ElementRef>;
  @ViewChildren('paletaColores') paletaColores!: QueryList<ElementRef>;
  @ViewChildren('cuadrosAdicionales') cuadrosAdicionales!: QueryList<ElementRef>;

  constructor(private router: ActivatedRoute, private route: Router, private renderer: Renderer2, private personalizarService: PersonalizarService, private sessionService: SessionService, private formBuilder: FormBuilder) {
    this.estiloSeleccionado = {id: 0, titulo: '', descripcion: '', imagen: '', precio: 0};
    this.idEstilo = 1;
    this.paletaSeleccionada = "Defecto";
    this.idPaleta = 0;
    this.adicionalesSelec = [];
    this.total = 0;
    this.tituloPers = 'Motorhome MobileHome';
    this.precioMotorhome = 48000;
    this.precioPaleta = 1200.12;
  }

  ngOnInit(): void {
    this.obtenerDatos();
    this.validarCompraForm();
  }

  obtenerDatos() {
    this.personalizarService.obtenerEstilos().subscribe(datos => {
      this.estilos = datos;
      this.estiloSeleccionado = this.estilos.find(estilo => estilo.id === this.idEstilo);
      this.sumarTotal();
    });
    this.personalizarService.obtenerAdicionales().subscribe(datos => {
      this.adicionales = datos;
    });
  }

  validarCompraForm() {
    this.formCompra = this.formBuilder.group({
      nroTrj: ['', [Validators.required, Validators.pattern(/^\d{6,6}$/)]],
      cv: ['', [Validators.required, Validators.pattern(/^\d{3,3}$/)]]
    });
  }

  seleccionarEstilo(id:number) {
    // Esto hace que al seleccionar un estilo al cuadro se le agregue una clase con estilos
    let cuadroEstilo = this.cuadrosEstilos.toArray()[this.idEstilo - 1];
    this.renderer.removeClass(cuadroEstilo.nativeElement, 'cuadro-seleccionado');
    this.idEstilo = id;
    cuadroEstilo = this.cuadrosEstilos.toArray()[this.idEstilo - 1];
    this.renderer.addClass(cuadroEstilo.nativeElement, 'cuadro-seleccionado');
    // Agrega la animacion del cuadro informativo del estilo seleccionado
    this.renderer.removeClass(this.estiloAnimado.nativeElement, 'animate__fadeIn');
    setTimeout(() => {
      this.renderer.addClass(this.estiloAnimado.nativeElement, 'animate__fadeIn');
      this.estiloSeleccionado = this.estilos.find(estilo => estilo.id === this.idEstilo);
      this.sumarTotal();
    }, 100);
  }

  seleccionarColor(numeroColor:number, nombreColor:string) {
    // Se elimina el estilo de seleccion ala paleta seleccionada anterior
    let color = this.paletaColores.toArray()[this.idPaleta];
    this.renderer.removeClass(color.nativeElement, 'color-seleccionado');
    // Se guarda el numero y nombre del color seleccionado
    this.idPaleta = numeroColor;
    this.paletaSeleccionada = nombreColor;
    // Se añade el estilo de seleccion a la nueva paleta seleccionada
    color = this.paletaColores.toArray()[this.idPaleta];
    this.renderer.addClass(color.nativeElement, 'color-seleccionado');
    this.sumarTotal();
  }

  seleccionarAdicional(id:number) {
    let cuadroAd = this.cuadrosAdicionales.toArray()[id - 1];
    // Si el array no esta vacio
    if (this.adicionalesSelec.length != 0) {
      let existeObjeto = this.adicionalesSelec.some(ad => ad.id === id);
      if (!existeObjeto) { // Se agrega el adicional a la lista si no esta agregado
        this.adicionalesSelec.push(this.adicionales.find(ad => ad.id === id));
        this.renderer.addClass(cuadroAd.nativeElement, 'adicional-seleccionado');
      }
      else { // Se elimina el adicional de la lista si ya esta agregado
        this.adicionalesSelec = this.adicionalesSelec.filter(ad => ad.id !== id)
        this.renderer.removeClass(cuadroAd.nativeElement, 'adicional-seleccionado');
      }
    }
    // Si el array esta vacio
    else { // Se agrega el adicional a la lista
      this.adicionalesSelec.push(this.adicionales.find(ad => ad.id === id));
      this.renderer.addClass(cuadroAd.nativeElement, 'adicional-seleccionado');
    }
    this.sumarTotal();
  }

  sumarTotal() {
    this.total = 0;
    this.total += this.precioMotorhome;
    this.total += this.precioPaleta;
    this.total += this.estiloSeleccionado.precio;
    if (this.adicionalesSelec.length != 0) {
      this.adicionalesSelec.forEach(adicional => {
        this.total += adicional.precio;
      });
    }
    this.total = parseFloat(this.total.toFixed(2));
  }

  comprar() {
    if (this.formCompra.valid) {
      const producto: Producto = {
        id: undefined,
        titulo: this.tituloPers,
        categoria: 'Motorhome personalizado',
        descripcion: 'Explora el mundo con estilo y comodidad a bordo de este motorhome personalizado, diseñado para ofrecerte todo lo que necesitas en tus aventuras, sin renunciar al lujo de tu hogar. Dimensiones: 7,5 m de largo, 2,2 m de ancho, 3 m de alto. Motor: Diésel 2.8L de bajo consumo, ideal para viajes largos. Capacidad: Hasta 4 personas cómodamente alojadas. Con este motorhome, cada viaje es una experiencia única. Personalizable en colores, materiales y acabados para que refleje tu estilo.',
        precio: this.total,
        imagen: 'personalizado.jpg',
        estilo: this.estiloSeleccionado,
        paletaColores: this.idPaleta,
        esPersonalizado: true
      };
      const usuario: Usuario = this.sessionService.getSession('user');
      const adicionales: Adicional[] = this.adicionalesSelec;
      this.personalizarService.registrarCompra(producto, usuario, adicionales).subscribe();
      this.route.navigate(['/home']);
      this.formCompra.reset();
      Swal.fire('Compra realizada con éxito!', `Has comprado un motorhome personalizado a un precio total de $${producto.precio}`, `success`);
    }
    else {
      console.log("Error en la compra");
    }
  }

  estaElUsuarioLogueado(): boolean {
    return this.sessionService.estaLogueado();
  }

  errorLogin() {
    Swal.fire('El usuario no esta logueado!', `Para poder realizar una compra primero debes iniciar sesión.`, `error`);
  }

  onInputChange(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    if (input.length > 0) {
      this.tituloPers = input;
    }
    else {
      this.tituloPers = 'Motorhome MobileHome';
    }
  }

}
