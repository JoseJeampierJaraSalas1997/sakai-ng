import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

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

    constructor(private http: HttpClient, private formBuilder: FormBuilder) {}

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

    enviarDatosAlBackend() {
        if (this.totalAPagar > 0) {
            const urlBackend = `${this.backendUrl}PostPaymenDatProduct`;

            this.http.put(urlBackend, null).subscribe(
                (response) => {
                    console.log('Datos enviados correctamente:', response);
                    this.mostrarSweetAlert();
                },
                (error) => {
                    console.error('Error al enviar datos al backend:', error);
                }
            );
        } else {
            Swal.fire({
                icon: 'error',
                title: 'No tienes items que pedir',
                imageUrl: 'https://www.unfv.edu.pe/images/logo_aniversario.png',
                imageWidth: 300,
                imageHeight: 100,
                imageAlt: 'UNFV',
                html: '<p>Selcciona tus productos</p>',
                confirmButtonText: `<span class="custom-whatsapp-button">Ver productos</span>`,
                showCancelButton: true,
                cancelButtonText: 'Cerrar',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.open(
                        'http://localhost:4200/#/uikit/list');
                }
            });
        }
    }

    mostrarSweetAlert() {
        Swal.fire({
            icon: 'success',
            title: 'Orden exitosa',
            imageUrl: 'https://www.unfv.edu.pe/images/logo_aniversario.png',
            imageWidth: 300,
            imageHeight: 100,
            imageAlt: 'Imagen de éxito',
            html: '<p>Tu orden fue exitosa</p>',
            confirmButtonText: `<span class="custom-whatsapp-button">Ir a WhatsApp</span>`,
            showCancelButton: true,
            cancelButtonText: 'Cerrar',
        }).then((result) => {
            if (result.isConfirmed) {
                window.open(
                    'https://api.whatsapp.com/send?phone=+51968097419&text=Hola%20acabo%20de%20relizar%20un%20pedido,%20porfavor%20agilizarlo',
                    '_blank'
                );
                location.reload();
            } else {
                location.reload();
              }
        });
    }
}
