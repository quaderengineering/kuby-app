import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CubeIconUploader } from './cube-icon-uploader';

describe('CubeIconUploader', () => {
  let component: CubeIconUploader;
  let fixture: ComponentFixture<CubeIconUploader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CubeIconUploader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CubeIconUploader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
