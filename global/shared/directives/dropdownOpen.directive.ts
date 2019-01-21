import { Directive, ElementRef, OnDestroy, Host, HostListener, Renderer2 } from '@angular/core';
import { DropdownDirective } from './dropdown.directive';

@Directive({
    selector: '[appDropdownOpen]',
})
export class DropdownOpenDirective implements OnDestroy {

    private closeDropdown: (event: Event) => void;

    private timer: number;
    private timerRun = false;

    private listenClick: Function;
    private listenMousemove: Function;


    @HostListener('click')
    onClick() {
        if (this.dropdown.type !== 'click') { return; }

        if (this.dropdown.isOpened()) {
            this.close();
        } else {
            this.open();
        }
    }

    @HostListener('mouseenter')
    onHover() {
        if (this.dropdown.type !== 'hover') { return; }
        this.open();
    }

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(
        @Host() public dropdown: DropdownDirective,
        private elementRef: ElementRef,
        private renderer: Renderer2,
    ) {
        this.closeDropdown = (event: MouseEvent) => this.closeIfInClosableZone(event);
    }

    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnDestroy() {
        if (this.listenClick) { this.listenClick(); }
        if (this.listenMousemove) { this.listenMousemove(); }
    }


    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    toggle() {
        if (this.dropdown.isOpened()) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (this.dropdown.isOpened()) { return; }

        this.dropdown.open();

        this.listenClick = this.renderer.listen('document', 'click', this.closeDropdown);
        this.listenMousemove = this.renderer.listen('document', 'mousemove', this.closeDropdown);
    }

    close() {
        if (!this.dropdown.isOpened()) { return; }

        this.dropdown.close();

        if (this.listenClick) { this.listenClick(); }
        if (this.listenMousemove) { this.listenMousemove(); }
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private closeIfInClosableZone(event: Event) {
        if (!this.dropdown.isInClosableZone(<HTMLElement>event.target)
            && event.target !== this.elementRef.nativeElement
            && !this.elementRef.nativeElement.contains(event.target)) {

            if (event.type === 'click') {
                clearTimeout(this.timer);
                this.timerRun = false;
                this.dropdown.close();
                if (this.listenClick) { this.listenClick(); }
                if (this.listenMousemove) { this.listenMousemove(); }
            }

            if (!this.timerRun) {
                this.timerRun = true;
                this.timer = window.setTimeout(() => {

                    this.dropdown.close();
                    this.timerRun = false;

                    if (this.listenClick) { this.listenClick(); }
                    if (this.listenMousemove) { this.listenMousemove(); }

                }, 900);
            }
        } else {
            this.timerRun = false;
            clearTimeout(this.timer);
        }
    }
}
