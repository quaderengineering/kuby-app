import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CubeDataDialog } from './cube-data-dialog';

describe('CubeDataDialog', () => {
  let component: CubeDataDialog;
  let fixture: ComponentFixture<CubeDataDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CubeDataDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CubeDataDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
