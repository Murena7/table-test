import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum'
})
export class SumPipe implements PipeTransform {

  transform(items: any[], attr: string): any {
    if (items) {
      return items.reduce((a, b) => a + b[attr], 0);
    } else {
      return 0;
    }
}

}
