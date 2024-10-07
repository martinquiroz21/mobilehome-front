import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisMotorhomesComponent } from './mis-motorhomes.component';

describe('MisMotorhomesComponent', () => {
  let component: MisMotorhomesComponent;
  let fixture: ComponentFixture<MisMotorhomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisMotorhomesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisMotorhomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
