import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
    templateUrl: './formlayoutdemo.component.html',
})
export class FormLayoutDemoComponent implements OnInit {
    private apiUrl = environment.apiUrl;
    productForm: FormGroup;
    imagePreview: string | ArrayBuffer;

    defaultImageURL =
        'https://i.blogs.es/9ea134/alimentos-saludables/1366_2000.jpg';

    constructor(private fb: FormBuilder, private http: HttpClient) {
        this.productForm = this.fb.group({
            nombre: ['', Validators.required],
            descripcion: ['', Validators.required],
            precio: [0, [Validators.required, Validators.min(0)]],
            stock: [0, [Validators.required, Validators.min(0)]],
            fechaVencimiento: ['', Validators.required],
            registroSanitario: ['', Validators.required],
            imagenes: this.fb.array([]),
            categoria: ['', Validators.required],
        });

        this.imagePreview = this.defaultImageURL;
    }

    ngOnInit() {}

    onSubmit() {
        if (this.productForm.dirty && this.productForm.valid) {
            const formData = new FormData();

            formData.append('nombre', this.productForm.value.nombre);
            formData.append('descripcion', this.productForm.value.descripcion);
            formData.append('precio', this.productForm.value.precio);
            formData.append('stock', this.productForm.value.stock);
            formData.append(
                'fechaVencimiento',
                this.productForm.value.fechaVencimiento
            );
            formData.append(
                'registroSanitario',
                this.productForm.value.registroSanitario
            );

            const imagenes = this.productForm.value.imagenes;
            for (let i = 0; i < imagenes.length; i++) {
                formData.append('imagenes', imagenes[i].file);
            }
            formData.append('categorias',this.productForm.value.categoria);
            // Configuración de encabezados (opcional)
            const headers = new HttpHeaders({
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
            });

            // Convertir FormData a un objeto simple para imprimirlo en la consola
            const formDataObject: { [key: string]: any } = {};
            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });

            console.log('Datos enviados al backend:', formDataObject);

            // Enviar FormData al backend
            this.http.post(`${this.apiUrl}saveProduct`, formData).subscribe(
                (response: any) => {
                    console.log(response);

                    Swal.fire({
                        title: 'Producto Registrado',
                        text: `Producto: ${response.producto.nombre} registrado con éxito`,
                        icon: 'success',
                    }).then(() => {
                        this.productForm.reset();
                        this.imagePreview = this.defaultImageURL;
                    });
                },
                (error) => {
                    console.error('Error al enviar los datos:', error);
                }
            );
        } else {
            Swal.fire({
                title: 'Formulario Vacío',
                text: 'Por favor, complete todos los campos del formulario.',
                icon: 'warning',
            });
        }
    }

    onFileChange(event: any): void {
        const files = event.target.files;
        const imageArray = this.productForm.get('imagenes') as FormArray;

        imageArray.clear();

        this.imagePreview = null;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            const imageFormGroup = this.fb.group({
                file: file,
                name: file.name,
                type: file.type,
                size: file.size,
            });

            imageArray.push(imageFormGroup);
        }

        this.showImagePreview(event);
    }

    showImagePreview(event: any): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        const reader = new FileReader();

        reader.onload = () => {
            this.imagePreview = reader.result as string;
            console.log('Imagen cargada:', this.imagePreview);
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            this.imagePreview = this.defaultImageURL;
        }
    }
}
