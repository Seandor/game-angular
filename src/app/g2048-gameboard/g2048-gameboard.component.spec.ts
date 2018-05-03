import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { G2048GameboardComponent } from './g2048-gameboard.component';

describe('G2048GameboardComponent', () => {
  let component: G2048GameboardComponent;
  let fixture: ComponentFixture<G2048GameboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ G2048GameboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(G2048GameboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
