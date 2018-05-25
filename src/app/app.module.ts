import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';
import 'rxjs/add/operator/map';

import { AppComponent } from './app.component';

import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';
import { ManageComponent } from './components/manage/manage.component';
import { FooterAdminComponent } from './components/footer-admin/footer-admin.component';
import { HotelsComponent } from './components/hotels/hotels.component';
import { HotelService } from './services/hotel.service';
import { SliderModule } from 'angular-image-slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Import your library
import { OwlModule } from 'ngx-owl-carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { NgxPaginationModule } from 'ngx-pagination';
import { AddnewsComponent } from './components/addnews/addnews.component';

import { IonRangeSliderModule } from "ng2-ion-range-slider";


@NgModule({
  declarations: [
    AppComponent,
    ManageComponent,
    NavbarAdminComponent,
    FooterAdminComponent,
    HotelsComponent,
    AddnewsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    SliderModule,
    BrowserAnimationsModule,
    HttpClientModule,
    OwlModule,
    NgbModule.forRoot(),
    NgxPaginationModule,
    IonRangeSliderModule
  ],
  providers: [HotelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
