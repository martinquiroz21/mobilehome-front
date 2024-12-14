import { CommonModule, ViewportScroller, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, Event, NavigationEnd } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { Usuario } from '../../../servicios/usuario';
import Swal from 'sweetalert2';
import { SessionService } from '../../../servicios/session.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  seccion:string;
  formRegistro:FormGroup;
  formLogin:FormGroup;
  usuarios:Usuario[];
  usuario:Usuario;

  constructor(private usuarioService: UsuariosService, private sessionService: SessionService, private router: Router, private location: Location, private viewportScroller: ViewportScroller, private formBuilder: FormBuilder) {
    this.seccion = "";
    this.usuario = new Usuario();
    this.desplazarPaginaAInicio();
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.ubicacionPagina();
    });
    this.obtenerTodosLosUsuarios();
    this.validacionRegistro();
  }

  obtenerTodosLosUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe(datos => {
      this.usuarios = datos;
    });
  }

  desplazarPaginaAInicio() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // Desplazarse al inicio de la página en cada navegación
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }

  ubicacionPagina(): void {
    this.seccion = this.location.path();
    if (this.seccion.includes('personalizar')) {
      this.seccion = 'personalizar';
    }
    if (this.seccion.includes('productos')) {
      this.seccion = 'productos';
    }
    if (this.seccion.includes('servicios')) {
      this.seccion = 'servicios';
    }
    if (this.seccion.includes('nosotros')) {
      this.seccion = 'nosotros';
    }
  }

  validacionRegistro() {
    this.formRegistro = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, emailUniqueValidator(this.usuarios)]],
      contrasenia: ['', [Validators.required, Validators.minLength(4)]]
    });
    this.formLogin = this.formBuilder.group({
      emailLogin: ['', [Validators.required, Validators.email]],
      contraseniaLogin: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  registrarse() {
    if (this.formRegistro.valid) {
      this.usuario = { 
        id: undefined,
        nombre: this.formRegistro.get('nombre').value,
        apellido: this.formRegistro.get('apellido').value,
        email: this.formRegistro.get('email').value,
        contrasena: this.formRegistro.get('contrasenia').value
      };
      this.usuarioService.registrarUsuario(this.usuario).subscribe(dato => {
        this.usuario = dato;
        this.router.navigate(['/home']);
        this.formRegistro.reset();
        Swal.fire('Registro realizado!', `El usuario ${this.usuario.nombre} ha sido registrado con exito.`, `success`);
      });
    }
    else {
      console.log('Formulario inválido');
    }
  }

  loguearse() {
    if (this.formLogin.valid) {
      let email = this.formLogin.get('emailLogin').value;
      let contrasena = this.formLogin.get('contraseniaLogin').value;
      const existeUsuario = (this.usuarios || []).some(user => user.email === email && user.contrasena === contrasena);
      this.formLogin.reset();
      if (existeUsuario) {
        let usuarioLogueado:Usuario = this.usuarios.find(user => user.email === email);
        this.sessionService.setSession('user', usuarioLogueado);
      }
      else {
        Swal.fire('No existe el usuario!', `Los valores ingresados son incorrectos.`, `error`);
      }
    }
  }

  estaElUsuarioLogueado(): boolean {
    return this.sessionService.estaLogueado();
  }

  obtenerNombreUsuario(): string  {
    let usuario = this.sessionService.getSession('user');
    return usuario.nombre + " " + usuario.apellido;
  }

  cerrarSesion() {
    this.sessionService.removeSession('user');
    this.router.navigate(['/home']);
  }
}

export function emailUniqueValidator(usuarios: { email: string }[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    const emailExists = (usuarios || []).some(user => user.email === email);
    return emailExists ? { emailTaken: true } : null;
  };
}
