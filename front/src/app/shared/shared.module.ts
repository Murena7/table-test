import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SumPipe } from './pipe/sum.pipe';
import { SumoftwoPipe } from './pipe/sumoftwo.pipe';
import { CustomdatePipe } from './pipe/customdate.pipe';

@NgModule({
  declarations: [SumPipe, SumoftwoPipe, CustomdatePipe],
  imports: [
    CommonModule
  ],
  exports: [SumPipe, SumoftwoPipe, CustomdatePipe]
})
export class SharedModule { }
