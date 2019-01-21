import { ElementRef, HostListener, Directive, AfterContentChecked, Renderer2 } from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: 'textarea[autosize]'
})
export class AutosizeDirective implements AfterContentChecked {

    @HostListener('input', ['$event.target'])
    onInput(): void {
        this.adjust();
    }

    constructor(
        public element: ElementRef,
        private renderer: Renderer2,
    ) { }

    ngAfterContentChecked(): void {
        this.adjust();
    }

    adjust(): void {
        this.renderer.setStyle(this.element.nativeElement, 'overflow', 'hidden');
        this.renderer.setStyle(this.element.nativeElement, 'height', 'auto');
        this.renderer.setStyle(this.element.nativeElement, 'height', this.element.nativeElement.scrollHeight + 'px');
    }
}
