import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertDataHoraBr'
})
export class ConvertDataHoraBrPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value) {
      var data = value.split('T');
      var data1 = data[0].split('-');
      return data1[2] +'/'+data1[1]+'/'+data1[0] + ' ' + data[1].substr(0, 8);
    }
  }

}
