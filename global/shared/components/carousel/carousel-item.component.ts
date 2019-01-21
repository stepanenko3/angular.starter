import {
    Component,
    Renderer2,
    ContentChildren,
    QueryList,
    ElementRef,
    ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';

import { CarouselLazyLoadDirective } from '../../directives';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'carousel-item',
    template: `
        <div #carouselItem class="carousel-item fade" style="outline: none">
            <ng-content></ng-content>
        </div>
    `,
    styles: [`
        :host {
            width: 100%;
            min-width: 100%;
        }

        .carousel-item {
            user-select: none;
            -moz-user-select: none;
            -khtml-user-select: none;
            -webkit-user-select: none;
            -o-user-select: none;
            -ms-user-select: none;
        }

        .carousel-item {
            height: 100%;
            width: 100%;
            overflow: hidden;
            background: #fff;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselItemComponent {

    @ContentChildren(CarouselLazyLoadDirective, { descendants: true }) lazyLoadedImages: QueryList<CarouselLazyLoadDirective>;

    public speed: number;
    public position = 0;
    public zIndex: number;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private cd: ChangeDetectorRef
    ) { }

    get elRef(): ElementRef {
        return this.el;
    }

    setzIndex(zIndex: number) {
        this.zIndex = zIndex;
        this.renderer.setStyle(this.el.nativeElement, 'z-index', zIndex);
    }

    setPosition(position: number) {
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translate3d(' + position + 'rem, 0, 0)');
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transform', 'translate3d(' + position + 'rem, 0, 0)');
        this.renderer.setStyle(this.el.nativeElement, '-moz-transform', 'translate3d(' + position + 'rem, 0, 0)');
        this.renderer.setStyle(this.el.nativeElement, '-o-transform', 'translate3d(' + position + 'rem, 0, 0)');
        this.renderer.setStyle(this.el.nativeElement, '-ms-transform', 'translate3d(' + position + 'rem, 0, 0)');
    }

    fadeIn(duration: number) {
        this.renderer.setStyle(this.el.nativeElement, 'transition', 'none');
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        setTimeout(() => {
            this.renderer.setStyle(this.el.nativeElement, 'transition', 'opacity ' + duration + 'ms');
            this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        }, 50);
    }

    lazyLoad() {
        this.lazyLoadedImages.map(img => img.load());
    }
}
