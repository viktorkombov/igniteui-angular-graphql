import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { CustomHierarchicalGridComponent } from './custom-hierarchical-grid/custom-hierarchical-grid.component';
import { IgxGridModule, IgxHierarchicalGridModule } from 'igniteui-angular';
import { APOLLO_OPTIONS } from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
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
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'http://localhost:4000/',
          }),
        };
      },
      deps: [HttpLink],
    },
    GraphQLService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
