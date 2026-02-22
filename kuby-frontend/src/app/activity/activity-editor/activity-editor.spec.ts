import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityEditor } from './activity-editor';

describe('ActivityEditor', () => {
  let component: ActivityEditor;
  let fixture: ComponentFixture<ActivityEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
