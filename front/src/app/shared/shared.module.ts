import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SumPipe } from './pipe/sum.pipe';
import { SumoftwoPipe } from './pipe/sumoftwo.pipe';

@NgModule({
  declarations: [SumPipe, SumoftwoPipe],
  imports: [
    CommonModule
  ],
  exports: [SumPipe, SumoftwoPipe]
})
export class SharedModule { }
