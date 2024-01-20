import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentationRoutingModule } from './documentation-routing.module';
import { DocumentationComponent } from './documentation.component';
import { TableModule } from 'primeng/table';
import { CarouselModule } from 'primeng/carousel';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    imports: [
        CommonModule,
        DocumentationRoutingModule,
        TableModule,
        CarouselModule,
        ReactiveFormsModule,
        FontAwesomeModule
    ],
    declarations: [DocumentationComponent]
})
export class DocumentationModule { }
