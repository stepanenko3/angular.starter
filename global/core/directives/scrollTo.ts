import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { ScrollToService } from '../services';

@Directive({
    selector: '[appScrollTo]'
})
export class ScrollToDirective implements OnInit {

    @Input() scrollTo: any;
    @Input() scrollOffset: number;

    constructor(private scrollToService: ScrollToService) {
    }

    ngOnInit(): void {
        this.scrollOffset = (!this.scrollOffset) ? 0 : this.scrollOffset;
    }

    @HostListener('mousedown')
    onMouseClick() {
        this.scrollToService.scrollTo(this.scrollTo, this.scrollOffset);
    }
}
