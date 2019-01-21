import { Injectable, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class RoundProgressService {
    private _base: HTMLBaseElement;
    private _hasPerf: boolean;
    public supportsSvg: boolean;

    constructor(
        @Optional() @Inject(DOCUMENT) document: any,
        @Inject(PLATFORM_ID) protected platformId: Object
    ) {
        this.supportsSvg = !!(
            document &&
            document.createElementNS &&
            document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect
        );

        this._base = document && document.head.querySelector('base');
        this._hasPerf = typeof window !== 'undefined' &&
            window.performance &&
            window.performance.now &&
            typeof window.performance.now() === 'number';
    }

    resolveColor(color: string): string {
        if (this._base && this._base.href) {
            const hashIndex = color.indexOf('#');

            if (hashIndex > -1 && color.indexOf('url') > -1) {
                return color.slice(0, hashIndex) + location.href + color.slice(hashIndex);
            }
        }

        return color;
    }
}
