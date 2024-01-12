import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  templateUrl: './formlayoutdemo.component.html'
})
export class FormLayoutDemoComponent implements OnInit {
  productForm: FormGroup;
  imagePreview: string | ArrayBuffer;

  // URL de la imagen predeterminada
  defaultImageURL = 'https://i.blogs.es/9ea134/alimentos-saludables/1366_2000.jpg';

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      fechaVencimiento: ['', Validators.required],
      registroSanitario: ['', Validators.required],
      imagenes: this.fb.array([]),
    });

    // Inicializar la vista previa con la imagen predeterminada
    this.imagePreview = this.defaultImageURL;
  }

  ngOnInit() {
    // No necesitas volver a inicializar el productForm aquí, ya lo hiciste en el constructor.
  }

  onSubmit() {
    console.log(this.productForm.value);
  }

  onFileChange(event: any) {
    const files = event.target.files;
    const imageArray = this.productForm.get('imagenes') as FormArray;

    // Limpiar el FormArray antes de agregar nuevas imágenes
    imageArray.clear();

    // Limpiar la vista previa de la imagen
    this.imagePreview = null;

    // Iterar sobre los archivos y agregarlos al FormArray
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = () => {
        // Crear un nuevo FormGroup para cada imagen
        const imageFormGroup = this.fb.group({
          file: reader.result,
          name: file.name,
          type: file.type,
          size: file.size
        });

        // Agregar el FormGroup al FormArray
        imageArray.push(imageFormGroup);
      };

      // Leer la imagen como URL
      reader.readAsDataURL(file);
    }

    // Mostrar la vista previa de la primera imagen (si hay alguna)
    this.showImagePreview(event);
  }

  // Método para mostrar la vista previa de la imagen seleccionada
  showImagePreview(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
      console.log(this.imagePreview); // Agrega este log para verificar la URL de la imagen
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      // Si no se selecciona ninguna imagen, mostrar la imagen predeterminada
      this.imagePreview = this.defaultImageURL;
    }
  }
}
