import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleGetListItems } from './example-get-list-items';

describe('ExampleGetListItems', () => {
  let component: ExampleGetListItems;
  let fixture: ComponentFixture<ExampleGetListItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleGetListItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExampleGetListItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
