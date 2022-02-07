import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IgxHierarchicalGridModule } from 'igniteui-angular';
import { CustomHierarchicalGridComponent } from './custom-hierarchical-grid.component';

describe('CustomHierarchicalGridComponent', () => {
  let component: CustomHierarchicalGridComponent;
  let fixture: ComponentFixture<CustomHierarchicalGridComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomHierarchicalGridComponent ],
      imports: [ NoopAnimationsModule, IgxHierarchicalGridModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomHierarchicalGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
