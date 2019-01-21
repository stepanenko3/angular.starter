import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({ selector: '[appCarouselLazyLoad]' })
export class CarouselLazyLoadDirective {
    @Input() appCarouselLazyLoad: string;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) { }

    load() {
        const img = this.el.nativeElement;
        if (img.src) {
            return;
        }

        if (img.tagName === 'IFRAME') {
            const url = new URL(this.appCarouselLazyLoad);
            url.searchParams.append('enablejsapi', '1');
            this.appCarouselLazyLoad = url.toString();
        }

        img.src = this.appCarouselLazyLoad;
        this.renderer.listen(img, 'load', (event) => { });
    }
}
