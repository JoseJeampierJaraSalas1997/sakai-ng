// app-topbar.component.ts
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { CarritoService } from '../../app/demo/service/carrito.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {
  carritoCantidad: number = 0;
  items!: MenuItem;
  private apiUrl = environment.apiUrl;

  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(
    public layoutService: LayoutService, private http: HttpClient) {}

  ngOnInit() {
    this.mostrarCarrito();
    this.obtenerCantidadProductosVendidos();
  }

  obtenerCantidadProductosVendidos() {
    this.http.get<any>(`${this.apiUrl}getProductsCount`).subscribe(
      (response) => {
        this.carritoCantidad = response.data;
        console.log('La cantidad de productos es que tiene el carrito es:', this.carritoCantidad);
      },
      (error) => {
        console.error('Error al obtener la cantidad de productos vendidos:', error);
        // Aquí puedes manejar el error
      }
    );
  }

  mostrarCarrito() {
    console.log('Mostrar carrito. Cantidad:', this.carritoCantidad);
  }
}
