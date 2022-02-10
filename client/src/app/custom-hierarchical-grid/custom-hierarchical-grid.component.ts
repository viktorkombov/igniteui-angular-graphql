import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FilteringLogic, IGridCreatedEventArgs, IgxColumnComponent, IgxHierarchicalGridComponent } from 'igniteui-angular';
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
    this.updateRootGridData([], FilteringLogic.And);

    this.hGrid.advancedFilteringExpressionsTreeChange.subscribe(e => {
      if (e) {
        this.updateRootGridData(e.filteringOperands, e.operator)
      } else {
        this.updateRootGridData([], FilteringLogic.And);
      }
    });
  }

  public dateFormatter(val: string) {
    return new Intl.DateTimeFormat('en-US').format(new Date(val));
  }

  public gridCreated(event: IGridCreatedEventArgs, _key: string) {
    this.updateChildGridData(event.grid, _key, event.parentID, [], FilteringLogic.And)

    event.grid.advancedFilteringExpressionsTreeChange.subscribe(e => {
      if (e) {
        this.updateChildGridData(event.grid, _key, event.parentID, e.filteringOperands, e.operator);
      } else {
        this.updateChildGridData(event.grid, _key, event.parentID, [], FilteringLogic.And);
      }
    });
  }

  private updateRootGridData(filteringOperands: any[], filteringOperator?: FilteringLogic): void {
    const dataState: IDataState = {
      parentID: '',
      key: 'Artists'
    };
    this.hGrid.isLoading = true;

    this.remoteService.getData(dataState, filteringOperands, filteringOperator).subscribe(
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

  private updateChildGridData(grid: IgxHierarchicalGridComponent, key: any,
    parentID: any, filteringOperands: any[], filteringOperator?: FilteringLogic) {
    const dataState: IDataState = {
      parentID: parentID,
      key: key,
    };
    grid.isLoading = true;

    this.remoteService.getData(dataState, filteringOperands, filteringOperator).subscribe(
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

