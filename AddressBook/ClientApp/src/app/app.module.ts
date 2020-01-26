import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatDialogModule,
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatPaginatorModule,
  MatTableModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatGridListModule,
} from '@angular/material';
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { AddressBookService } from '../shared/addressbook.service';
import { ContactsDialogComponent } from './contacts-dialog/contacts-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { SignalrChartComponent } from './signalr-chart/signalr-chart.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpErrorInterceptor } from './interceptors/http-error-interceptor';



@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    ContactsListComponent,
    ContactsDialogComponent,
    ConfirmDialogComponent,
    SignalrChartComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ChartsModule,
    MatGridListModule,
    FlexLayoutModule,
    RouterModule.forRoot([
      { path: '', component: ContactsListComponent, pathMatch: 'full' },
      { path: 'chart', component: SignalrChartComponent, pathMatch: 'full' }
    ])
  ],
  providers: [AddressBookService, MatDatepickerModule, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true

  }],
  bootstrap: [AppComponent],
  entryComponents: [ContactsDialogComponent, ConfirmDialogComponent]
})
export class AppModule { }
