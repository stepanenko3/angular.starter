import { Directive, ElementRef, EventEmitter, Input, Output, AfterViewInit, OnDestroy } from '@angular/core';
import { ScrollService } from '@core/services';
import { Subscription } from 'rxjs/internal/Subscription';

@Directive({
    selector: '[appInViewport]'
})
export class InViewportDirective implements AfterViewInit, OnDestroy {

    @Output() hitViewport: EventEmitter<any> = new EventEmitter();

    private sub: Subscription = new Subscription();

    private rect;
    private inViewport: boolean;
    private windowHeight: number;

    constructor(
        private el: ElementRef,
        private scrollService: ScrollService,
    ) {
        this.sub.add(this.scrollService.scroll$.subscribe(e => this.check(e)));
        this.sub.add(this.scrollService.resize$.subscribe(() => {
            this.setWindowHeight();
            this.check(null);
        }));
    }

    ngAfterViewInit() {
        this.setWindowHeight();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    private setWindowHeight() {
        this.windowHeight = window.innerHeight || document.documentElement.clientHeight;
    }

    private check(e) {
        this.rect = this.el.nativeElement.getBoundingClientRect();

        if (this.rect && this.rect.top && this.rect.bottom <= this.windowHeight) {
            if (!this.inViewport) {
                this.inViewport = true;
                this.hit(e);
            }
        } else {
            this.inViewport = false;
        }
    }

    private hit(e) {
        this.sub.unsubscribe();
        this.hitViewport.emit({
            el: this.el.nativeElement,
            e: e
        });
    }
}
