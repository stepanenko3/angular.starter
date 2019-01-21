import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    HostBinding,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnChanges
} from '@angular/core';

@Component({
    selector: 'app-carousel-dots',
    template: `
        <div class="dot" *ngFor="let index of numbers" (click)="click(index)"
             [class.active]="activeDot === index" [class.dark]="dark"></div>
    `,
    styles: [`
        :host {
            position: absolute;
            display: inline-block;
            z-index: 1000;
        }

        :host(.left) {
            bottom: 10px;
            left: 10px;
        }

        :host(.right) {
            bottom: 10px;
            right: 10px;
        }

        :host(.middle) {
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            -webkit-transform: translateX(-50%);
            -moz-transform: translateX(-50%);
            -o-transform: translateX(-50%);
            -ms-transform: translateX(-50%);
        }

        .dot {
            height: 10px;
            width: 10px;
            border-radius: 5px;
            background: white;
            opacity: .6;
            margin: 0 4px;
            display: inline-block;
        }

        .dot.dark {
            background: rgba(136,136,136,.4);
        }

        .dot:hover {
            opacity: .8;
            cursor: pointer;
        }

        .dot.active {
            opacity: .8;
        }

        .dot.dark:hover, .dot.dark.active {
            background: #888;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CarouselDotsComponent implements OnInit, OnChanges {
    numbers: Array<number>;

    @Input() activeDot = 0;
    @Input() dotsCount: number;

    @HostBinding('class')
    @Input() position = 'left';
    @Input() dark = false;

    @Output() clickEvent = new EventEmitter<number>();

    constructor(
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.numbers = Array(this.dotsCount).fill(0).map((x, i) => i);
    }

    click(index: any) {
        this.clickEvent.emit(index);
        this.activeDot = index;
        this.cd.detectChanges();
    }

    ngOnChanges(changes) {
        if (changes.dotsCount && !changes.dotsCount.firstChange) {
            this.numbers = Array(changes.dotsCount.currentValue).fill(0).map((x, i) => i);
        }
    }
}
