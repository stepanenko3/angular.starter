import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'round' })
export class RoundPipe implements PipeTransform {
    transform(number, precision) {
        const rounder = Math.pow(10, precision);
        return Math.round(number * rounder) / rounder;
    }
}
