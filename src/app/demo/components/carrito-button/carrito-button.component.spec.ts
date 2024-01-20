import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoButtonComponent } from './carrito-button.component';

describe('CarritoButtonComponent', () => {
  let component: CarritoButtonComponent;
  let fixture: ComponentFixture<CarritoButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarritoButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
