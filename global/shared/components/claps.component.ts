import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output
} from '@angular/core';

import { animate, style, query, transition, trigger, keyframes, group } from '@angular/animations';
import { ColorsService } from '@core/services';

const incrementCounterAnimation =
    trigger('incrementCounterAnimation', [
        transition(':enter', [
            style({ transform: 'translate3d(0,50%,0)', opacity: 0 }),
            animate('200ms ease-in', style({ transform: 'translate3d(0,0,0)', opacity: 1 }))
        ]),
        transition(':leave', [
            style({ transform: 'translate3d(0,0,0)', opacity: 1 }),
            animate('200ms ease-out', style({ transform: 'translate3d(0,-100%,0)', opacity: 0 }))
        ]),
    ]);

const pointsAnimation = trigger('pointsAnimation', [
    transition(':leave', [
        group([
            query('.claps-effect__triangles', animate('370ms ease-out', keyframes([
                style({ transform: 'scale(1)', opacity: 0 }),
                style({ transform: 'scale(1.3)', opacity: 1 }),
                style({ transform: 'scale(1.6)', opacity: 0 }),
            ]))),
            query('.claps-effect__dots', animate('370ms ease-out', keyframes([
                style({ transform: 'scale(1)', opacity: 0 }),
                style({ opacity: 1 }),
                style({ transform: 'scale(1.5)', opacity: 0 }),
            ]))),
        ])
    ]),
]);

// export const pulseGrowAnimation =
//     trigger('pulseGrowAnimation', [
//         transition('* => *', [
//             style({transform: 'scale(1)'}),
//             animate('400ms ease-out', keyframes([
//                 style({transform: 'scale(1)'}),
//                 style({transform: 'scale(1.1)'}),
//                 style({transform: 'scale(1)'})
//             ]))
//         ]),
//     ]);

@Component({
    moduleId: module.id,
    selector: 'app-claps',
    templateUrl: 'claps.component.html',
    animations: [incrementCounterAnimation, pointsAnimation],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClapsComponent {

    @Input() initClaps = 0;
    @Input() max = 50;
    @Input() count = 0;
    @Input() disabled = false;
    @Input() color = '#0070c9';

    @Input() small = false;

    @Output() change = new EventEmitter();
    @Output() disabledClick = new EventEmitter();

    public _started = false;
    public increment = 0;

    public timer;
    public intervalTimer;

    public effects: number[] = [];

    constructor(
        private cd: ChangeDetectorRef,
        private colors: ColorsService,
    ) { }

    public decrementAll() {
        if ((this.count > 0 || this.increment > 0) && !this.disabled) {
            clearTimeout(this.timer);
            clearInterval(this.intervalTimer);

            this.increment = 0;

            if (this.count > 0) {
                this.initClaps -= this.count;
                this.count = 0;

                this.change.emit({
                    claps: this.initClaps - this.count,
                    my: 0
                });
            }

            this.cd.detectChanges();
        }
    }

    public start(e) {
        e.preventDefault();
        if (this.disabled) {
            this.disabledClick.emit();
            return;
        }

        if (!this._started && (this.increment + this.count < this.max)) {
            this._started = true;
            this.increment++;
            this.effects.push(Math.random() * 360);
            setTimeout(() => this.effects.shift());
            clearTimeout(this.timer);
            this.cd.detectChanges();
            this.intervalTimer = setInterval(() => {
                if (this.increment + this.count < this.max) {
                    this.increment++;
                    this.effects.push(Math.random() * 360);
                    setTimeout(() => this.effects.shift());
                } else {
                    clearInterval(this.intervalTimer);
                }

                this.cd.detectChanges();
            }, 200);
        }

    }

    public stop(e) {
        e.preventDefault();
        if (this._started && !this.disabled) {
            this._started = false;
            clearInterval(this.intervalTimer);
            this.cd.detectChanges();

            this.timer = setTimeout(() => {
                this.initClaps += this.increment;
                this.count += this.increment;
                this.increment = 0;

                this.change.emit({
                    claps: this.initClaps,
                    my: this.count
                });

                this.cd.detectChanges();
            }, 500);
        }
    }

    public shadeColor(color: string, percent: number = 0): string {
        return this.colors.shade(color, percent);
    }
}
