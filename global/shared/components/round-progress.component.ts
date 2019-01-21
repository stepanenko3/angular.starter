import {
    Component,
    Input,
    Output,
    NgZone,
    EventEmitter,
    ViewChild,
    Renderer2, ChangeDetectionStrategy, ChangeDetectorRef, HostListener, AfterViewInit, HostBinding,
} from '@angular/core';
import { RoundProgressConfig, RoundProgressService } from '../services';


@Component({
    selector: 'app-round-progress',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <svg xmlns="http://www.w3.org/2000/svg" [attr.viewBox]="_viewBox">
            <circle fill="none"
                    [attr.cx]="radius"
                    [attr.cy]="radius"
                    [attr.r]="radius - stroke / 2"
                    [style.fill]="resolveColor(background)"></circle>

            <circle #bar
                    fill="none"
                    [attr.cx]="radius"
                    [attr.cy]="radius"
                    [attr.r]="radius - (stroke * 1.75) - (stroke / 2)"
                    [style.transition]="'stroke-dashoffset ' + duration + 'ms ' + animation"
                    [style.stroke]="resolveColor(color)"
                    [style.stroke-width]="stroke"
                    [style.stroke-dasharray]="getStrokeDashArray()"
                    [style.stroke-linecap]="'round'"
                    [style.stroke-linejoin]="'round'">
                <animateTransform attributeName="transform" type="rotate" [attr.calcMode]="spinAnimation"
                                  [attr.values]="'0 ' + radius + ' ' + radius + ';360 ' + radius + ' ' + radius"
                                  keyTimes="0;1"
                                  [attr.dur]="spinDuration + 'ms'" begin="0s"
                                  repeatCount="indefinite"></animateTransform>
            </circle>
            <path fill="none"
                  [style.stroke]="resolveColor(color)"
                  [style.stroke-width]="stroke"
                  [style.stroke-linecap]="'round'"
                  [style.stroke-linejoin]="'round'"
                  [attr.d]="getD()"
                  [style.transition]="'d ' + duration + 'ms ' + animation">
            </path>
        </svg>
    `,
    styles: [`
        :host {
            display: block;
            position: relative;
            overflow: hidden;
            cursor: pointer;
        }

        :host.responsive {
            width: 100%;
            padding-bottom: 100%;
        }

        :host.responsive > svg {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
    `]
})
export class RoundProgressComponent implements AfterViewInit {

    @HostBinding('attr.role') baseRole = 'progressbar';
    @HostBinding('attr.aria-valuemin') get bindValueMin() { return this._current; }
    @HostBinding('attr.aria-valuemax') get bindValueMax() { return this.max; }
    @HostBinding('style.width') get bindStyleWidth() { return this.responsive ? '' : this._diameter + 'px'; }
    @HostBinding('style.height') get bindStyleHeight() { return this._elementHeight; }
    @HostBinding('style.padding-bottom') get bindStylePaddingBottom() { return this._paddingBottom; }
    @HostBinding('style.transition') get bindStyleTransition() { return 'all ' + this.duration + 'ms ' + this.animation; }
    @HostBinding('style.opacity') get bindStyleOpacity() { return this._show ? 1 : 0; }
    @HostBinding('style.visibility') get bindStyleVisibility() { return this._show ? 'visible' : 'hidden'; }
    @HostBinding('class.responsive') get bindClassResponsive() { return this.responsive; }

    constructor(private _service: RoundProgressService,
        private _defaults: RoundProgressConfig,
        private _ngZone: NgZone,
        private _renderer: Renderer2,
        private cd: ChangeDetectorRef) {
    }

    get _diameter(): number {
        return this.radius * 2;
    }

    get _elementHeight(): string {
        if (!this.responsive) {
            return (this.semicircle ? this.radius : this._diameter) + 'px';
        }
    }

    get _viewBox(): string {
        const diameter = this._diameter;
        return `0 0 ${diameter} ${this.semicircle ? this.radius : diameter}`;
    }

    get _paddingBottom(): string {
        if (this.responsive) {
            return this.semicircle ? '50%' : '100%';
        }
    }


    _current = 0;
    _show = false;
    _success = false;
    _error = false;

    @ViewChild('bar') _bar;
    @Input() max: number;
    @Input() radius: number = this._defaults.get('radius');
    @Input() animation: string = this._defaults.get('animation');
    @Input() duration: number = this._defaults.get('duration');
    @Input() spinAnimation: string = this._defaults.get('spinAnimation');
    @Input() spinDuration: number = this._defaults.get('spinDuration');
    @Input() stroke: number = this._defaults.get('stroke');
    @Input() color: string = this._defaults.get('color');
    @Input() background: string = this._defaults.get('background');
    @Input() responsive: boolean = this._defaults.get('responsive');
    @Input() clockwise: boolean = this._defaults.get('clockwise');
    @Input() semicircle: boolean = this._defaults.get('semicircle');
    @Input() showCancel: boolean = this._defaults.get('showCancel');
    @Output() render: EventEmitter<number> = new EventEmitter();
    @Output() cancel: EventEmitter<boolean> = new EventEmitter();

    getD(): string {
        if (this._success) {
            return 'M ' + this.p(70) + ' ' + this.p(108) + ' A 00 00 0 0 0 ' + this.p(70) + ' ' + this.p(108)
                + ' L ' + this.p(95) + ' ' + this.p(130) + ' L ' + this.p(130) + ' ' + this.p(70);
        } else if (this._error) {
            return 'M ' + this.p(100) + ' ' + this.p(70) + ' A 00 00 0 0 0 ' + this.p(100) + ' ' + this.p(110)
                + 'M ' + this.p(100) + ' ' + this.p(130) + ' A 00 00 0 0 0 ' + this.p(100) + ' ' + this.p(130);
        } else if (this.showCancel && this._current > 0) {
            return 'M ' + this.p(70) + ' ' + this.p(70) + ' A 00 00 0 0 0 ' + this.p(70) + ' ' + this.p(70)
                + ' L ' + this.p(130) + ' ' + this.p(130) + ' L ' + this.p(100) + ' ' + this.p(100)
                + ' L ' + this.p(130) + ' ' + this.p(70) + ' L ' + this.p(70) + ' ' + this.p(130);
        }
        return '';
    }

    p(val: number): number {
        return val / 100 * this.radius;
    }

    ngAfterViewInit() {
        this._setDashOffset(0);
    }

    getStrokeDashArray(): number {
        return Math.PI * 2 * (this.radius - (this.stroke * 1.75) - this.stroke / 2);
    }

    private _setDashOffset(value: number): void {
        if (this._bar) {
            this._renderer.setStyle(this._bar.nativeElement, 'stroke-dashoffset',
                this.getStrokeDashArray() / this.max * (this.max - value));
            this.cd.detectChanges();
        }
    }

    public set(current: number, callback: () => void = () => { }): void {
        if (current < 0) { current = 0; }
        if (current > this.max) { current = this.max; }
        if (current >= this.max) {
            this.complete(callback);
        } else {
            this._current = current;
            this._show = current > 0;
            this._success = false;
            this._error = false;
            this._setDashOffset(current);
        }
    }

    public inc(increment: number, callback: () => void = () => { }): void {
        this.set(this._current + increment, callback);
    }

    public complete(callback: () => void = () => { }): void {
        this._current = this.max;
        this._setDashOffset(this.max);
        this._show = true;
        this._success = true;
        this._error = false;
        this.cd.detectChanges();

        setTimeout(() => {
            if (this._current === this.max) {
                this._show = false;
                callback();
            }
            this.cd.markForCheck();
        }, 1000);

        setTimeout(() => {
            if (this._current === this.max) { this.set(0); }
        }, 1000 + this.duration);
    }

    public error(callback: () => void = () => { }) {
        this._current = 0;
        this._setDashOffset(0);
        this._show = true;
        this._error = true;
        this._success = false;
        this.cd.detectChanges();

        setTimeout(() => {
            if (this._error && this._current === 0) { this._show = false; }
            this._error = false;
            callback();
            this.cd.markForCheck();
        }, 1000 + this.duration);
    }

    resolveColor(color: string): string {
        return this._service.resolveColor(color);
    }

    @HostListener('click', ['$event'])
    clickCancel(event) {
        if (this.showCancel && this._current > 0 && this._show && !this._success && !this._error) {
            this._setDashOffset(0);
            this._show = false;
            this._success = false;
            this._error = false;
            this.cd.detectChanges();
            this.cancel.next(event);
            setTimeout(() => this.set(0), this.duration);
        }
    }
}
