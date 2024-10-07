import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { PersonalizarComponent } from './componentes/personalizar/personalizar.component';
import { ProductosComponent } from './componentes/productos/productos.component';
import { ServiciosComponent } from './componentes/servicios/servicios.component';
import { MisMotorhomesComponent } from './componentes/mis-motorhomes/mis-motorhomes.component';
import { NosotrosComponent } from './componentes/nosotros/nosotros.component';

export const routes: Routes = [
    { path: 'home', component:HomeComponent },
    { path: 'personalizar', component:PersonalizarComponent },
    { path: 'productos', component:ProductosComponent },
    { path: 'servicios', component:ServiciosComponent },
    { path: 'nosotros', component:NosotrosComponent },
    { path: 'mismotorhomes', component:MisMotorhomesComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'home'}
];