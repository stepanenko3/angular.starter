import { Pipe, PipeTransform } from '@angular/core';
import { RoundPipe } from './round.pipe';

const SUFFIXES = ['', 'k', 'M', 'B', 'T', 'Q'];

@Pipe({
    name: 'humanizeNumber'
})
export class HumanizePipe implements PipeTransform {

    constructor(private roundPipe: RoundPipe) {
    }

    transform(number, precision) {
        if (precision === undefined) { precision = 1; }
        if (!number) { return '0'; }
        if (number > -1 && number < 1) { return this._stringify(number, precision); }

        const suffixIndex = Math.floor(Math.log(Math.abs(number)) / Math.log(1000));
        const value = number / Math.pow(1000, suffixIndex);

        return this._stringify(value, precision) + SUFFIXES[suffixIndex];
    }

    private _stringify(num, precision) {
        return this.roundPipe.transform(num, precision).toString();
    }
}
