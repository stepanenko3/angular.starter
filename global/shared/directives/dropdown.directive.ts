import {
    Directive, ElementRef, ContentChild, Output, EventEmitter, Input
} from '@angular/core';

import { DropdownNotClosableZoneDirective } from './dropdownNotClosableZone.directive';

@Directive({
    selector: '[appDropdown]',
})
export class DropdownDirective {

    // -------------------------------------------------------------------------
    // Inputs / Outputs
    // -------------------------------------------------------------------------

    @Input() type = 'click';
    @Output() openEvent = new EventEmitter();
    @Output() closeEvent = new EventEmitter();

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    @ContentChild(DropdownNotClosableZoneDirective)
    notClosableZone: DropdownNotClosableZoneDirective;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private elementRef: ElementRef) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    open(): void {
        const element: HTMLElement = this.elementRef.nativeElement;
        element.classList.add('dropdown_open');
        this.openEvent.emit(undefined);
    }

    close(): void {
        const element: HTMLElement = this.elementRef.nativeElement;
        element.classList.remove('dropdown_open');
        this.closeEvent.emit(undefined);
    }

    isOpened(): boolean {
        const element: HTMLElement = this.elementRef.nativeElement;
        return element.classList.contains('dropdown_open');
    }

    isInClosableZone(element: HTMLElement): boolean {
        if (!this.notClosableZone) { return false; }

        return this.notClosableZone.contains(element);
    }

}
