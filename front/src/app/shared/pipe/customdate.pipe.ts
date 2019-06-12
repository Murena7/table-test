import {Inject, Injectable, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import { formatDate } from '@angular/common';


@Injectable()
@Pipe({name: 'customdate', pure: true})
export class CustomdatePipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}
  transform(value: any, format = 'mediumDate', timezone?: string, locale?: string): string|null {
    if (value == null || value === '' || value !== value) { return null; }
    if (value.toString().length < 3) {
      return value;
    }
    try {
      return formatDate(value, format, locale || this.locale, timezone);
    } catch (error) {
      return value;
    }
  }
}
