import {
    Directive,
    ElementRef
} from '@angular/core';

import * as Payment from 'payment';

@Directive({
    selector: '[appCCCvc]'
})
export class CCCvcFormatDirective {

    constructor(private el: ElementRef) {
        const element = this.el.nativeElement;

        // call lib functions
        Payment.formatCardCVC(element);
        Payment.restrictNumeric(element);
    }

}
