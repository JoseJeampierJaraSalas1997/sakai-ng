import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CarritoService } from '../../service/carrito.service'

@Component({
  selector: 'app-carrito-button',
  templateUrl: './carrito-button.component.html',
})
export class CarritoButtonComponent implements OnInit {
  @Output() productoAgregado: EventEmitter<void> = new EventEmitter<void>();
  carritoCantidad: number = 0;

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    // Inicializar la cantidad del carrito al valor actual
    this.actualizarCantidadCarrito();
  }

  agregarAlCarrito() {
    const productoId = 123; // Obtener el ID del producto de alguna manera
    this.carritoService.agregarAlCarrito(productoId);

    // Actualizar la cantidad del carrito después de agregar un producto
    this.actualizarCantidadCarrito();

    // Emitir un evento para notificar que se ha agregado un producto
    this.productoAgregado.emit();
  }

  private actualizarCantidadCarrito() {
    // Obtener la cantidad actual del carrito desde el servicio
    this.carritoCantidad = this.carritoService.calcularCantidadCarrito();
  }
}