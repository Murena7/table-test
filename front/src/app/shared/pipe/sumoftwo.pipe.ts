import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumoftwo'
})
export class SumoftwoPipe implements PipeTransform {

  transform(items: any[], attr1: string, attr2: string): any {
    if (items) {
      return items.reduce((a, b) => a + (b[attr1] + b[attr2]), 0);
    } else {
      return 0;
    }
  }

}
