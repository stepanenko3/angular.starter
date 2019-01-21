import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-carousel-arrow',
    template: `
        <div class="carousel__arrow" (click)="onClick()"
             [ngClass]="{left : dir === 'left', right : dir === 'right', disabled  : disabled}"></div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CarouselArrowComponent {
    @Input() dir: string;
    @Input() dark: boolean;

    @Input() disabled = true;

    @Output() clickEvent: EventEmitter<any> = new EventEmitter<any>();

    onClick() {
        if (!this.disabled) {
            this.clickEvent.emit();
        }
    }
}
