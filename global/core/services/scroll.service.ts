import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { fromEvent, Subject, combineLatest } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { auditTime, takeUntil } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable()
export class ScrollService {

    scroll$ = new BehaviorSubject<any>(null);
    resize$ = new BehaviorSubject<any>(null);
    pos: number;

    private disableState = false;
    private _savePos: number;

    public unsubscribe$ = new Subject<any>();

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.manageScrollPos();

        if (isPlatformBrowser(this.platformId)) {
            fromEvent(window, 'scroll')
                .pipe(auditTime(16))
                .subscribe(e => this.scroll$.next(e));

            fromEvent(window, 'resize')
                .pipe(auditTime(16))
                .subscribe(e => this.resize$.next(e));

            combineLatest(this.scroll$, this.resize$)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(() => this.manageScrollPos());
        }
    }


    private manageScrollPos(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.pos = window.pageYOffset;
            // if (this.disableState) {
            //     window.scrollTo(0, this._savePos);
            // }
        } else {
            this.pos = 0;
        }
    }

    public disable() {
        this.disableState = true;
        document.documentElement.classList.add('disabledScroll');
    }

    public enable() {
        this.disableState = false;
        document.documentElement.classList.remove('disabledScroll');
    }
}
