import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {WebcamModule} from 'ngx-webcam';
import { QrComponent } from './qr/qr.component';
import { OcrComponent } from './ocr/ocr.component';

@NgModule({
  declarations: [
    AppComponent,
    QrComponent,
    OcrComponent
  ],
  imports: [
    BrowserModule,
    WebcamModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
