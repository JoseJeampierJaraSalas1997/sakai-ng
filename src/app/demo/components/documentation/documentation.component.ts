import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    templateUrl: './documentation.component.html',
    styleUrls: ['./documentation.component.scss'],
})
export class DocumentationComponent implements OnInit {
    private backendUrl = environment.apiUrl;
    form: FormGroup;
    totalAPagar: number = 0;
    productosSeleccionados = [];
    userInfoConsulta = [];
    images: string[] = [];

    constructor(private http: HttpClient, private formBuilder: FormBuilder) {

    }

    ngOnInit() {
        this.userInfo();
        this.productsList();
        this.form = this.formBuilder.group({
            codigoestudiante: new FormControl(''),
            tpago: new FormControl(''),
            ubicacionrecojo: new FormControl(''),
            celular: new FormControl(''),
        });
    }
    
    calcularTotalAPagar() {
        this.totalAPagar = this.productosSeleccionados.reduce(
            (total, producto) => {
                return total + producto.precio * producto.cantidad;
            },
            0
        );
        console.log(this.totalAPagar);
    }

    userInfo() {
        this.http.get(`${this.backendUrl}getUserSearch`).subscribe(
            (response: any) => {
                this.userInfoConsulta = response.data.map((user) => ({
                    id: user.user_id,
                    nombre: `${user.username}`,
                }));

                if (this.userInfoConsulta.length > 0) {
                    const usuario = this.userInfoConsulta[0];
                    this.form.get('codigoestudiante').setValue(usuario.id);
                }
            },
            (error) => {
                console.error(
                    'Error al obtener la información del backend:',
                    error
                );
            }
        );
    }

    productsList() {
        this.http.get(`${this.backendUrl}getProductsOfPayments`).subscribe(
            (response: any) => {
                const rutaServidorImagenes = `${this.backendUrl}uploads`;

                const imagenesUnicas = [
                    ...new Set(
                        response.data.map((producto) => producto.imagen)
                    ),
                ];

                this.images = imagenesUnicas.map(
                    (imagen) => `${rutaServidorImagenes}/${imagen}`
                );

                const productosGrouped = response.data.reduce(
                    (acc, producto) => {
                        const idProducto = producto.id_producto;

                        if (!acc[idProducto]) {
                            acc[idProducto] = {
                                id: idProducto,
                                nombre: producto.nombre,
                                precio: parseFloat(producto.precio),
                                cantidad: 0,
                                imagen: `${rutaServidorImagenes}/${producto.imagen}`,
                            };
                        }

                        acc[idProducto].cantidad++;

                        return acc;
                    },
                    {}
                );
                this.productosSeleccionados = Object.values(productosGrouped);
                this.calcularTotalAPagar();
            },
            (error) => {
                console.error(
                    'Error al obtener la información del backend:',
                    error
                );
            }
        );
    }

    enviarDatosAlBackend(event: Event, datos: any) {
        event.preventDefault();
        const urlBackend = `${this.backendUrl}PostPaymenDatProduct`;
    
        console.log('Datos del formulario:', datos);
    
        this.http.post(urlBackend, datos).subscribe(
            (response) => {
                console.log('Datos enviados correctamente:', response);
            },
            (error) => {
                console.error('Error al enviar datos al backend:', error);
            }
        );
    }
    
}
