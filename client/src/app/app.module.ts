import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { CustomHierarchicalGridComponent } from './custom-hierarchical-grid/custom-hierarchical-grid.component';
import { IgxGridModule, IgxHierarchicalGridModule } from 'igniteui-angular';
import { HttpClientModule } from '@angular/common/http';
import { GraphQLService } from './graphql.service';

@NgModule({
  declarations: [
    AppComponent,
    CustomHierarchicalGridComponent
  ],
  imports: [
    BrowserModule,
    HammerModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IgxGridModule,
    IgxHierarchicalGridModule
  ],
  providers: [
    GraphQLService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
