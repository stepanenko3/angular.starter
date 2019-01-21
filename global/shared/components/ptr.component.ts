import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, OnInit, OnChanges } from '@angular/core';

import { Subject, fromEvent, merge } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-ptr',
    template: `
        <div class="app-ptr" [ngStyle]="{
            transition: _animating ? 'all .4s ease' : 'none',
            transform: (transform$ | async)
        }">
            <span [ngStyle]="{
                transition: _animating ? 'all .4s ease' : 'none',
                transform: 'scale(' + (_pullPercent / 100) + ')',
                color: _pullPercent !== 100 ? '#5f5f5f' : '#1AAD19'
            }" [innerHtml]="_pullPercent !== 100 ? config.pullIcon : loading ? config.loadingIcon : config.successIcon">
            </span>
        </div>
    `,
    preserveWhitespaces: false,
})
export class PullToRefreshComponent implements OnInit, OnChanges {

    private ogY = 0;
    private touching = false;
    private touchId: any;
    private initScrollTop = 0;
    loading = false;
    _animating = false;
    _pullPercent = 0;

    _def = {
        customIcon: false,
        pullIcon: '<i class="fs fs-reload"></i>',
        loadingIcon: '<img src="/assets/img/loading.svg" />',
        successIcon: '<i class="fs fs-reload"></i>',
        treshold: 100,
    };

    @Input() config: any;
    @Input() disabled = false;
    @Input() container: HTMLElement;

    @Output() scroll = new EventEmitter<number>();
    @Output() refresh = new EventEmitter<PullToRefreshComponent>();

    touchstart$ = fromEvent<TouchEvent>(document, 'touchstart');
    touchmove$ = fromEvent<TouchEvent>(document, 'touchmove');
    touchend$ = fromEvent<TouchEvent>(document, 'touchend').pipe(map(() => {
        if (this.disabled || !this.touching || this.loading) {
            return;
        }
        this._animating = true;

        const _pullPercent = this._pullPercent;
        let loading = false;
        if (_pullPercent >= this.config.treshold) {
            this.setPercent(100);
            loading = true;
        } else {
            this.setPercent(0);
        }

        this.touching = false;
        this.ogY = 0;
        this.touchId = undefined;
        this.initScrollTop = 0;
        this.loading = loading;

        this.cd.detectChanges();

        if (loading) {
            this.refresh.emit(this);
        }
    }));

    pullPercent$ = this.touchstart$.pipe(
        switchMap((start: any) => {
            if (!this.container.contains(start.targetTouches[0].target)) {
                return;
            }

            if (this.disabled || this.touching || this.loading) {
                return;
            }

            this.touching = true;
            this.touchId = start.targetTouches[0].identifier;

            this.ogY =
                this._pullPercent === 0
                    ? start.targetTouches[0].pageY
                    : start.targetTouches[0].pageY - this._pullPercent;

            this.initScrollTop = this.container.scrollTop;
            this._animating = false;

            return this.touchmove$.pipe(
                map((move: any) => {
                    if (!this.container.contains(move.targetTouches[0].target)) {
                        return;
                    }

                    if (this.disabled || !this.touching || this.loading) {
                        return;
                    }

                    if (move.targetTouches[0].identifier !== this.touchId) {
                        return;
                    }

                    const pageY = move.targetTouches[0].pageY;
                    const diffY = pageY - this.ogY;
                    // if it's scroll
                    if (diffY < 0) {
                        return;
                    }
                    // if it's not at top
                    if (this.container.scrollTop > 0) {
                        return;
                    }

                    return diffY - this.initScrollTop > 100 ? 100 : diffY - this.initScrollTop;
                }),
                takeUntil(this.touchend$),
            );
        })
    );

    changePercent$ = new Subject<number>();

    transform$ = merge(this.pullPercent$, this.changePercent$).pipe(
        map((percent: number) => {
            this._pullPercent = percent;
            this.scroll.emit(this._pullPercent);
            this.cd.detectChanges();

            return 'translate3d(0,' + (-100 + percent) + 'px,0)';
        })
    );

    constructor(private cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.setPercent(0);
        this.parseConfig();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('config' in changes) { this.parseConfig(); }
    }

    setFinished() {
        this.loading = false;
        this._animating = true;
        this.setPercent(0);
        this.cd.detectChanges();

        if (!this.touching) {
            setTimeout(() => {
                this._animating = false;
                this.cd.detectChanges();
            }, 350);
        }
    }

    setPercent(percent: number) {
        this._pullPercent = percent;
        this.changePercent$.next(percent);
    }

    private parseConfig() {
        this.config = Object.assign({}, this._def, this.config);
    }
}
