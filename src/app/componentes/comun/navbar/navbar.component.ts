import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  seccion: String;

  constructor(private router: Router, private location: Location) {
    this.seccion = "";
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.ubicacionPagina();
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
  
}
