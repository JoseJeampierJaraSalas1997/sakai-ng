import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  templateUrl: './listdemo.component.html',
})
export class ListDemoComponent implements OnInit {
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

    this.sourceCities = [
      { name: 'San Francisco', code: 'SF' },
      { name: 'London', code: 'LDN' },
      { name: 'Paris', code: 'PRS' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Berlin', code: 'BRL' },
      { name: 'Barcelona', code: 'BRC' },
      { name: 'Rome', code: 'RM' },
    ];

    this.targetCities = [];
    this.orderCities = [];

    this.sortOptions = [
        { label: 'Precio de mayor a menor', value: '!precio' },
        { label: 'Precio de menor a mayor', value: 'precio' },
      ];
      
  }

  /*onSortChange(event: any) {
    const value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }*/
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

  
  
  
  
  
}
