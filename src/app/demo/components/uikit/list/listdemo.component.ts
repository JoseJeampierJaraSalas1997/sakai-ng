import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import Swal from 'sweetalert2';


@Component({
  templateUrl: './listdemo.component.html',
})
export class ListDemoComponent implements OnInit {
  carritoItems: { id: number, cantidad: number }[] = [];
  products: { data: any[] } = { data: [] };
  sortOptions: SelectItem[] = [];
  sortOrder: number = 0;
  sortField: string = '';
  sourceCities: any[] = [];
  targetCities: any[] = [];
  orderCities: any[] = [];
  loading: boolean = true;

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>(`${this.apiUrl}getListProducts`).subscribe(
      (data: any) => {
        console.log('Respuesta del backend:', data);

        if (data.success) {
          this.products.data = data.data;
        } else {
          console.error('Error en la respuesta del backend:', data.message);
        }

        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener productos del backend:', error);
        this.loading = false;
      }
    );

    this.targetCities = [];
    this.orderCities = [];

    this.sortOptions = [
        { label: 'Precio de mayor a menor', value: '!precio' },
        { label: 'Precio de menor a mayor', value: 'precio' },
    ];
  }

  onSortChange(event: any) {
    const value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;

      if (this.sortField === 'precio') {
        this.products.data.sort((a, b) => (parseFloat(a.precio) > parseFloat(b.precio) ? 1 : -1) * this.sortOrder);
      }
    }
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  agregarAlCarrito(productoId: number) {
    console.log('Agregando al carrito:', productoId);

    const productoEnCarrito = this.carritoItems.find(item => item.id === productoId);

    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      this.carritoItems.push({ id: productoId, cantidad: 1 });
    }

    const cantidadTotalProductos = this.carritoItems.reduce((total, item) => total + item.cantidad, 0);
    const cantidadTiposProductos = this.carritoItems.length;

    console.log(`Cantidad total de productos en el carrito: ${cantidadTotalProductos}`);
    console.log(`Cantidad de tipos de productos en el carrito: ${cantidadTiposProductos}`);
    console.log('Contenido del carrito:', this.carritoItems);
    const url_canasta = `${this.apiUrl}canasta/${productoId}`;

    this.http.put(url_canasta, {}).subscribe(
      (response) => {
        console.log('Respuesta del backend:', response);
        Swal.fire('Éxito', 'Producto agregado al carrito', 'success');
      },
      (error) => {
        console.error('Error al enviar la solicitud al backend:', error);
        Swal.fire('Error', 'Error al agregar el producto al carrito', 'error');
      }
    );
  }
}
