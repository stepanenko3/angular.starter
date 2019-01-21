import { Pipe, PipeTransform } from '@angular/core';
import { equals } from '@core/utils';

@Pipe({
    name: 'findValue',
})
export class FindValuePipe implements PipeTransform {
    value = '';
    lastValue: any[];
    lastArgs: string[];

    transform(value: any[], ...args: string[]): any {
        if (!value || typeof value !== 'object') {
            return value;
        }

        if (equals(value, this.lastValue) && equals(args, this.lastArgs)) {
            return this.value;
        }

        for (let i = 0; i < args.length; i++) {
            if (args[i] in value) {
                this.value = value[args[i]];
                break;
            }
        }

        return this.value;
    }
}
