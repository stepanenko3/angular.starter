import {
    Directive,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    OnInit,
    AfterViewInit,
    HostListener,
    PLATFORM_ID, Inject, Optional
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Directive({
    selector: '[appSticky]'
})
export class StickyDirective implements OnInit, AfterViewInit {
    @Input() zIndex = 10;
    @Input() width = 'auto';
    @Input() offsetTop = 0;
    @Input() offsetBottom = 0;
    @Input() start = 0;
    @Input() stickClass = 'sticky';
    @Input() endStickClass = 'sticky-end';
    @Input() mediaQuery = '';
    @Input() parentMode = true;
    @Input() orientation = 'none';

    @Output() activated = new EventEmitter();
    @Output() deactivated = new EventEmitter();
    @Output() reset = new EventEmitter();

    private isStuck = false;

    private elem: any;
    private container: any;
    private originalCss: any;

    private windowHeight: number;
    private containerHeight: number;
    private elemHeight: number;
    private containerStart: number;
    private scrollFinish: number;

    constructor(
        private element: ElementRef,
        @Inject(PLATFORM_ID) protected platformId: Object,
        @Optional() @Inject(DOCUMENT) private document: any,
    ) {
    }

    ngOnInit(): void {
        this.elem = this.element.nativeElement;
    }

    ngAfterViewInit(): void {
        this.container = this.elem.parentNode;
        this.defineOriginalDimensions();
        this.sticker();
    }

    @HostListener('window:scroll', ['$event'])
    @HostListener('window:resize', ['$event'])
    @HostListener('window:orientationchange', ['$event'])
    onChange(): void {
        this.sticker();
    }

    defineOriginalDimensions(): void {
        this.originalCss = {
            zIndex: this.getCssValue(this.elem, 'zIndex'),
            position: this.getCssValue(this.elem, 'position'),
            top: this.getCssValue(this.elem, 'top'),
            right: this.getCssValue(this.elem, 'right'),
            left: this.getCssValue(this.elem, 'left'),
            bottom: this.getCssValue(this.elem, 'bottom'),
            width: this.getCssValue(this.elem, 'width'),
        };

        if (this.width === 'auto') {
            this.width = this.originalCss.width;
        }
    }

    defineDimensions(): void {
        const containerTop: number = this.getBoundingClientRectValue(this.container, 'top');
        this.windowHeight = window.innerHeight;
        this.elemHeight = this.getCssNumber(this.elem, 'height');
        this.containerHeight = this.getCssNumber(this.container, 'height');
        this.containerStart = containerTop + this.scrollbarYPos() - this.offsetTop + this.start;
        if (this.parentMode) {
            this.scrollFinish = this.containerStart - this.start - this.offsetBottom + (this.containerHeight - this.elemHeight);
        } else {
            this.scrollFinish = (this.document) ? this.document.body.offsetHeight : 0;
        }
    }

    resetElement(): void {
        this.elem.classList.remove(this.stickClass);
        Object.assign(this.elem.style, this.originalCss);

        this.reset.next(this.elem);
    }

    stuckElement(): void {
        this.isStuck = true;

        this.elem.classList.remove(this.endStickClass);
        this.elem.classList.add(this.stickClass);

        Object.assign(this.elem.style, {
            zIndex: this.zIndex,
            position: 'fixed',
            top: this.offsetTop + 'px',
            right: 'auto',
            bottom: 'auto',
            left: this.getBoundingClientRectValue(this.elem, 'left') + 'px',
            width: this.width
        });

        this.activated.next(this.elem);
    }

    unstuckElement(): void {
        this.isStuck = false;

        this.elem.classList.add(this.endStickClass);

        this.container.style.position = 'relative';

        Object.assign(this.elem.style, {
            position: 'absolute',
            top: 'auto',
            left: 'auto',
            right: this.getCssValue(this.elem, 'float') === 'right' || this.orientation === 'right' ? 0 : 'auto',
            bottom: this.offsetBottom + 'px',
            width: this.width
        });

        this.deactivated.next(this.elem);
    }

    matchMediaQuery(): any {
        if (!this.mediaQuery) { return true; }
        return (
            window.matchMedia('(' + this.mediaQuery + ')').matches ||
            window.matchMedia(this.mediaQuery).matches
        );
    }

    sticker(): void {

        // check media query
        if (this.isStuck && !this.matchMediaQuery()) {
            this.resetElement();
            return;
        }

        // detecting when a container's height changes
        const currentContainerHeight: number = this.getCssNumber(this.container, 'height');
        if (currentContainerHeight !== this.containerHeight) {
            this.defineDimensions();
        }

        // check if the sticky element is above the container
        if (this.elemHeight >= currentContainerHeight) {
            return;
        }

        const position: number = this.scrollbarYPos();

        // unstick
        if (this.isStuck && (position < this.containerStart || position > this.scrollFinish) || position > this.scrollFinish) {
            this.resetElement();
            if (position > this.scrollFinish) { this.unstuckElement(); }
            this.isStuck = false;
        } else if (this.isStuck === false && position > this.containerStart && position < this.scrollFinish) {
            this.stuckElement();
        }
    }

    private scrollbarYPos(): number {
        return isPlatformBrowser(this.platformId) ? window.pageYOffset : 0;
    }

    private getBoundingClientRectValue(element: any, property: string): number {
        let result = 0;
        if (element && element.getBoundingClientRect) {
            const rect = element.getBoundingClientRect();
            result = (typeof rect[property] !== 'undefined') ? rect[property] : 0;
        }
        return result;
    }

    private getCssValue(element: any, property: string): any {
        let result: any = '';
        if (typeof window.getComputedStyle !== 'undefined') {
            result = window.getComputedStyle(element, '').getPropertyValue(property);
        } else if (typeof element['currentStyle'] !== 'undefined') {
            result = element['currentStyle'][property];
        }
        return result;
    }

    private getCssNumber(element: any, property: string): number {
        if (typeof element === 'undefined') { return 0; }
        return parseInt(this.getCssValue(element, property), 10) || 0;
    }
}