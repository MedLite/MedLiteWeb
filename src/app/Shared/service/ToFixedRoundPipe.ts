import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFixedRound'
})
export class ToFixedRoundPipe implements PipeTransform {

  transform(value: number | string | null | undefined): number {
    if (value === null || value === undefined || isNaN(parseFloat(value as string))) {
      return 0; // Or handle the null/undefined/NaN case as needed
    }


    const num = parseFloat(value as string);
    return Math.round(num); 
  }
}