import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'dateTime',
  standalone: true,
})
export class DateTimePipe implements PipeTransform {
  transform(value: string, format: string): string {
    if (value === '' || moment.isDate(value)) return '--';
    const timeZoneOffSet: number = new Date().getTimezoneOffset() * -1;
    return moment.parseZone(value).utcOffset(timeZoneOffSet).format(format);
  }
}
