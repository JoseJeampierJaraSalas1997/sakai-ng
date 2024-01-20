// carrito.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private carritoItems: { id: number; cantidad: number }[] = [];

  agregarAlCarrito(productoId: number) {
    const productoEnCarrito = this.carritoItems.find((item) => item.id === productoId);

    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      this.carritoItems.push({ id: productoId, cantidad: 1 });
    }
  }

  calcularCantidadCarrito(): number {
    return this.carritoItems.reduce((total, item) => total + item.cantidad, 0);
  }
}
