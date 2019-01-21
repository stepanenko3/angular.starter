import {
    Directive,
    ElementRef,
    Renderer2,
    HostListener, EventEmitter, Output
} from '@angular/core';

import * as Payment from 'payment';

@Directive({
    selector: '[appCCNum]'
})
export class CCNumberFormatDirective {

    cardType: string;

    @Output()
    cardTypeEvent: EventEmitter<string> = new EventEmitter<string>();

    constructor(private renderer: Renderer2, private el: ElementRef) {

        const element = this.el.nativeElement;
        this.cardType = '';
        this.cardTypeEvent.emit(this.cardType);

        console.log(Payment, Payment.fns);


        // call lib functions
        Payment.formatCardNumber(element);
        Payment.restrictNumeric(element);
    }

    @HostListener('keyup', ['$event']) onKeypress(e) {
        const element = this.el.nativeElement;
        const elementValue = element.value;

        this.cardType = Payment.fns.cardType(elementValue);

        if (this.cardType !== '' && this.cardType) {
            this.renderer.addClass(element, this.cardType);
        } else {
            this.cardType = '';
        }

        console.log(this.cardType);
        this.cardTypeEvent.emit(this.cardType);
    }
}
