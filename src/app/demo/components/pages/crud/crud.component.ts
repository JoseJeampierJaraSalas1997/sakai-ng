import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { SelectItem } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService],
})
export class CrudComponent implements OnInit {
    private apiUrl = environment.apiUrl;

    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];

    product: Product = {};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    private id_delete_url = 10;

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private http: HttpClient
    ) {}

    ngOnInit() {
        this.productService
            .getProducts()
            .then((data) => (this.products = data));

        this.cols = [
            { field: 'product', header: 'Producto' },
            { field: 'price', header: 'Precio' },
            { field: 'category', header: 'Categoría' },
            { field: 'rating', header: 'Rating' },
            { field: 'inventoryStatus', header: 'Status' },
        ];

        this.statuses = [
            { label: 'ENSTOCK', value: 'ENSTOCK' },
            { label: 'BAJOSTOCK', value: 'BAJOSTOCK' },
            { label: 'SINSTOCK', value: 'SINSTOCK' },
        ];
    }

    categoryOptions: SelectItem[] = [
        { label: 'Café', value: '1' },
        { label: 'Té', value: '2' },
        { label: 'Bebidas Frías', value: '3' },
        { label: 'Bocadillos', value: '4' },
        { label: 'Postres', value: '5' },
        { label: 'Desayuno', value: '6' },
        { label: 'Sandwiches', value: '7' },
        { label: 'Ensaladas', value: '8' },
        { label: 'Smoothies', value: '9' },
        { label: 'Snacks', value: '10' },
        { label: 'Panadería', value: '11' },
        { label: 'Sopas', value: '12' },
        { label: 'Bebidas Calientes', value: '13' },
        { label: 'Zumos Naturales', value: '14' },
        { label: 'Especialidades del Chef', value: '15' },
        { label: 'Helados', value: '16' },
        { label: 'Comida Saludable', value: '17' },
        { label: 'Almuerzos Rápidos', value: '18' },
        { label: 'Batidos', value: '19' },
        { label: 'Especialidades de Temporada', value: '20' },
    ];

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(
            (val) => !this.selectedProducts.includes(val)
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'Producto borrado',
            life: 3000,
        });
        this.selectedProducts = [];
    }
    

    deleteProduct(productId: number): Observable<any> {
        const url_delete = `${this.apiUrl}deleteProduct/${productId}`;
        this.id_delete_url = productId;
        this.deleteProductDialog = true;
        return this.http.put(url_delete, {});
    }

    confirmDelete() {
        const productId = this.id_delete_url;
    
        this.deleteProduct(productId).subscribe(
            () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Producto eliminado',
                    life: 3000,
                });
    
                this.productService.getProducts().then((data) => {
                    this.products = data;
                });
    
                this.product = {};
                this.deleteProductDialog = false;
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al eliminar el producto',
                    life: 3000,
                });
            }
        );
    }
    

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        const url_Update = `${this.apiUrl}updateOrCreateProduct`;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                console.log(
                    'Actualizando producto con los siguientes datos:',
                    this.product
                );
                this.http.put(url_Update, this.product).subscribe(
                    () => {
                        this.products[this.findIndexById(this.product.id)] =
                            this.product;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Producto Actualizado',
                            life: 3000,
                        });
                    },
                    (error) => {
                        console.error(
                            'Error al actualizar el producto:',
                            error
                        );
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Error al actualizar el producto',
                            life: 3000,
                        });
                    }
                );
            } else {
                console.log(
                    'Creando nuevo producto con los siguientes datos:',
                    this.product
                );
                this.http.post(url_Update, this.product).subscribe(
                    () => {
                        this.product.id = this.createId();
                        this.product.code = this.createId();
                        this.product.image = 'product-placeholder.svg';
                        this.products.push(this.product);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Producto Creado',
                            life: 3000,
                        });
                    },
                    (error) => {
                        console.error('Error al crear el producto:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Error al crear el producto',
                            life: 3000,
                        });
                    }
                );
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
