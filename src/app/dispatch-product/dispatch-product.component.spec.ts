import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchProductComponent } from './dispatch-product.component';

describe('DispatchProductComponent', () => {
  let component: DispatchProductComponent;
  let fixture: ComponentFixture<DispatchProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
