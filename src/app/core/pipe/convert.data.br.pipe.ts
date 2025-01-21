import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertDataBr'
})
export class ConvertDataBrPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    if (value) {
      var data = value.split('-');
      return data[2].substr(0, 2)+'/'+data[1]+'/'+data[0];
    }
  }

}
