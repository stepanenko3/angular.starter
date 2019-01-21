import { Injectable } from '@angular/core';

export interface RoundProgressDefaults {
    radius?: number;
    spinAnimation?: string;
    spinDuration?: number;
    animation?: string;
    duration?: number;
    stroke?: number;
    color?: string;
    background?: string;
    responsive?: boolean;
    clockwise?: boolean;
    semicircle?: boolean;
    showCancel?: boolean;
}

@Injectable()
export class RoundProgressConfig {
    private _options: RoundProgressDefaults = {
        radius: 50,
        spinAnimation: 'linear',
        spinDuration: 1800,
        animation: 'ease',
        duration: 500,
        stroke: 10,
        color: '#fff',
        background: 'rgba(0,0,0,.7)',
        responsive: false,
        clockwise: true,
        semicircle: false,
        showCancel: true,
    };

    setDefaults(config: RoundProgressDefaults): RoundProgressDefaults {
        return Object.assign(this._options, config);
    }

    get(key: string) {
        return this._options[key];
    }
}
