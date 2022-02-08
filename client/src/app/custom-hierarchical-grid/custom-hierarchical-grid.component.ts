import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { IGridCreatedEventArgs, IgxColumnComponent, IgxHierarchicalGridComponent } from 'igniteui-angular';
import { GraphQLService, IDataState } from '../graphql.service';

@Component({
  selector: 'app-custom-hierarchical-grid',
  templateUrl: './custom-hierarchical-grid.component.html',
  styleUrls: ['./custom-hierarchical-grid.component.scss']
})
export class CustomHierarchicalGridComponent implements AfterViewInit {
  @ViewChild('hGrid', { read: IgxHierarchicalGridComponent })
  public hGrid!: IgxHierarchicalGridComponent;

  constructor(@Inject(GraphQLService) private remoteService: GraphQLService, public cdr: ChangeDetectorRef) { }

  public ngAfterViewInit() {
    this.updateRootGridData([]);

    this.hGrid.advancedFilteringExpressionsTreeChange.subscribe(e => {
      if (e) {
        this.updateRootGridData(e.filteringOperands)
      } else {
        this.updateRootGridData([]);
      }
    });
  }

  public dateFormatter(val: string) {
    return new Intl.DateTimeFormat('en-US').format(new Date(val));
  }

  public gridCreated(event: IGridCreatedEventArgs, _parentKey: string) {
    this.updateChildGridData(event.grid, _parentKey, event.parentID, [])

    event.grid.advancedFilteringExpressionsTreeChange.subscribe(e => {
      if (e) {
        this.updateChildGridData(event.grid, _parentKey, event.parentID, e.filteringOperands);
      } else {
        this.updateChildGridData(event.grid, _parentKey, event.parentID, []);
      }
    });
  }

  private updateRootGridData(filteringOperands: any[]): void {
    const dataState: IDataState = {
      parentID: '',
      parentKey: 'Artists'
    };
    this.hGrid.isLoading = true;

    this.remoteService.getData(dataState, filteringOperands).subscribe(
      (data: any[]) => {
        this.hGrid.isLoading = false;
        this.hGrid.data = data;
        this.hGrid.cdr.detectChanges();
      },
      (error: any) => {
        this.hGrid.emptyGridMessage = error.message;
        this.hGrid.isLoading = false;
        this.hGrid.cdr.detectChanges();
      }
    );
  }

  private updateChildGridData(grid: IgxHierarchicalGridComponent, parentKey: any,
    parentID: any, filteringOperands: any[]) {
    const dataState: IDataState = {
      parentID: parentID,
      parentKey: parentKey,
    };
    grid.isLoading = true;

    this.remoteService.getData(dataState, filteringOperands).subscribe(
      (data: any[]) => {
        grid.isLoading = false;
        grid.data = data;
        grid.cdr.detectChanges();
      },
      (error: any) => {
        grid.emptyGridMessage = error.message;
        grid.isLoading = false;
        grid.cdr.detectChanges();
      }
    );
  }
}

