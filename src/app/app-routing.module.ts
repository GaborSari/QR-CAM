import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OcrComponent } from './ocr/ocr.component';
import { QrComponent } from './qr/qr.component';

const routes: Routes = [
  { path: '', component: OcrComponent },
  { path: 'qr', component: QrComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
