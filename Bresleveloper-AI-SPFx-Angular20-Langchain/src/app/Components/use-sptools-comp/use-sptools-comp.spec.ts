import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseSPToolsComp } from './use-sptools-comp';

describe('UseSPToolsComp', () => {
  let component: UseSPToolsComp;
  let fixture: ComponentFixture<UseSPToolsComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UseSPToolsComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UseSPToolsComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
