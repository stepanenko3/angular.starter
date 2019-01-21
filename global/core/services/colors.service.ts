import { Injectable } from '@angular/core';

const defaultColors = [
    '#1abc9c',
    '#3498db',
    '#f1c40f',
    '#8e44ad',
    '#e74c3c',
    '#d35400',
    '#2c3e50',
    '#7f8c8d'
];

@Injectable()
export class ColorsService {

    get(value: string, percent: number = 0): string {
        return this.shade(this.random(value), percent);
    }

    public random(value: string): string {
        if (!value) { return 'transparent'; }

        const asciiCodeSum = value.split('').map(letter => letter.charCodeAt(0))
            .reduce((previous, current) => previous + current);

        const colors = defaultColors;
        return colors[asciiCodeSum % colors.length];
    }

    public shade(color, percent): string {
        const f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent,
            // tslint:disable-next-line:no-bitwise
            R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;

        return '#' + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G)
            * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
    }
}
