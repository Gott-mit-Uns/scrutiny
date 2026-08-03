import { Pipe, PipeTransform } from '@angular/core';
import humanizeDuration from 'humanize-duration';

@Pipe({ name: 'deviceHours' })
export class DeviceHoursPipe implements PipeTransform {
    static format(hoursOfRunTime: number, unit: string, humanizeConfig: object): string {
      if (hoursOfRunTime === null) {
        return '未知';
      }
      if (unit === 'device_hours') {
          return `${hoursOfRunTime} 小时`;
        }
        return humanizeDuration(hoursOfRunTime * 60 * 60 * 1000, {
            language: 'zh_CN',
            ...humanizeConfig
        });
    }

  transform(hoursOfRunTime: number, unit = 'humanize', humanizeConfig: any = {}): string {
        return DeviceHoursPipe.format(hoursOfRunTime, unit, humanizeConfig)
  }
}
