import {
    Component,
    OnInit,
    QueryList,
    ContentChildren,
    Input,
    Output,
    HostListener,
    HostBinding,
    EventEmitter,
    ElementRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ViewChild,
    OnChanges,
    AfterViewInit,
    OnDestroy,
    SimpleChanges, Renderer2
} from '@angular/core';


import { CarouselItemComponent } from './carousel-item.component';
import { Subscription } from 'rxjs';
import { SwiperDirective } from '../../directives';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'carousel',
    template: `
        <div class="inner" #inner swiper>
            <ng-content></ng-content>
        </div>
        <app-carousel-dots *ngIf="dots && items?.length > 1" [dotsCount]="items?.length ? items.length : 0" position="middle"
                       [dark]="dark"
                       [activeDot]="currentItemIndex" (clickEvent)="to($event)"></app-carousel-dots>
        <app-carousel-arrow
                *ngIf="arrows && items?.length > 1 && ((!infinite && currentItemIndex > 0) || infinite)"
                dir="left" (clickEvent)="prev()" [dark]="dark" [disabled]="false"></app-carousel-arrow>
        <app-carousel-arrow
                *ngIf="arrows && items?.length > 1&& ((!infinite && currentItemIndex < items?.length - 1) || infinite)"
                dir="right" (clickEvent)="next()" [dark]="dark" [disabled]="false"></app-carousel-arrow>
    `,
    styles: [`
        :host {
            position: relative;
            overflow: hidden;
        }

        .inner {
            position: relative;
            display: flex;
            overflow: visible;
            padding: 0;
            height: 100%;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    constructor(
        private renderer: Renderer2,
        private cd: ChangeDetectorRef,
    ) {
    }

    get slideIndex(): number {
        return this.currentItemIndex;
    }

    get slide(): CarouselItemComponent {
        return this.getItemByIndex(this.currentItemIndex);
    }

    @Input() speed: number;
    @Input() autoPlay = true;
    @Input() autoPlaySpeed: number;

    @Input() dark = false;
    @Input() infinite = false;
    @Input() fade = false;
    @Input() touch = false;
    @Input() dots = true;
    @Input() arrows = true;

    @Output() change = new EventEmitter<any>();

    @ViewChild('inner') el: ElementRef;
    @ViewChild(SwiperDirective) swiper: SwiperDirective;
    @ContentChildren(CarouselItemComponent) items: QueryList<CarouselItemComponent>;

    private subscriptions = new Subscription();

    private _width: number;
    public currentItemIndex = 0;
    public interval: any;

    private firstItemIndex: number;
    private lastItemIndex: number;

    @HostBinding('class.carousel') _ = true;

    @HostListener('window:resize', ['$event'])
    onResize() {
        this._width =
            this.el.nativeElement.getBoundingClientRect().width /
            parseFloat(getComputedStyle(document.querySelector('body'))['font-size']);

        if (!this.fade) {
            this.setPosition(this._width * this.currentItemIndex * -1);
        } else {
            this.items.forEach((item, index) => item.setPosition(this._width * index * -1));
        }
    }

    @HostListener('mouseenter') mouseEnter() {
        if (this.autoPlay) { this.autoPlayFunction(false); }
    }

    @HostListener('mouseleave') mouseLeave() {
        if (this.autoPlay) { this.autoPlayFunction(true); }
    }

    ngOnInit(): void {
        this.speed = this.speed || 500;
        this.autoPlaySpeed = this.autoPlaySpeed || 1500;
        if (this.autoPlay) { this.autoPlayFunction(true); }

        this.subscriptions.add(this.change.subscribe((index: number) =>
            this.getItemByIndex(index).lazyLoad()));
    }

    ngAfterViewInit() {
        this.initItems(this.items);
        this.subscriptions.add(this.items.changes.subscribe(items => this.initItems(items)));
    }

    initItems(items: QueryList<CarouselItemComponent>) {
        if (items && items.length > 0) { this.change.emit(0); }
        this.items = items;

        this._width =
            this.el.nativeElement.getBoundingClientRect().width /
            parseFloat(getComputedStyle(document.querySelector('body'))['font-size']);

        this.firstItemIndex = 0;
        this.lastItemIndex = items.length - 1;

        if (!this.fade) {
            this.enableTransition();
            this.setPosition(this._width * this.currentItemIndex * -1);

            items.forEach((item, itemIndex) => {
                item.setPosition(0);
                item.setzIndex(1);

                const totalDistanceSwiped = 0;

                // this.subscriptions.add(item.swiper.onSwipeLeft.subscribe((distance: number) => {
                //     totalDistanceSwiped += Math.abs(distance);
                //     let shortDistance = distance / Math.pow(totalDistanceSwiped, .4);
                //     if (itemIndex === this.firstItemIndex && this.infinite) {
                //         this.rotateRight();
                //     }
                //     items.forEach((itm, index) => {
                //         if ((itemIndex === this.firstItemIndex || (itemIndex === this.lastItemIndex && distance > 0))
                //             && !this.infinite) {
                //             itm.currentPosition += shortDistance;
                //         } else {
                //             itm.currentPosition += distance;
                //         }
                //         itm.moveTo(itm.currentPosition);
                //     });
                // }));
                //
                // this.subscriptions.add(item.swiper.onSwipeRight.subscribe((distance: number) => {
                //     totalDistanceSwiped += Math.abs(distance);
                //     let shortDistance = distance / Math.pow(totalDistanceSwiped, .4);
                //     if (itemIndex === this.lastItemIndex && this.infinite) {
                //         this.rotateLeft();
                //     }
                //     items.forEach((itm, index) => {
                //         if ((itemIndex === this.lastItemIndex || (itemIndex === this.firstItemIndex && distance < 0))
                //             && !this.infinite) {
                //             itm.currentPosition += shortDistance;
                //         } else {
                //             itm.currentPosition += distance;
                //         }
                //         itm.moveTo(itm.currentPosition);
                //     });
                // }));
                //
                // this.subscriptions.add(item.swiper.swipeLeft.subscribe(() => {
                //     totalDistanceSwiped = 0;
                //     this.slideLeft();
                // }));
                //
                // this.subscriptions.add(item.swiper.swipeRight.subscribe(() => {
                //     totalDistanceSwiped = 0;
                //     this.slideRight();
                // }));
                //
                // this.subscriptions.add(item.swiper.onSwipeEnd.subscribe(() => {
                //     totalDistanceSwiped = 0;
                //     this.enableTransition();
                //     this.slideToPrevPosition();
                // }));
                //
                // this.subscriptions.add(item.swiper.onSwipeStart.subscribe(() => {
                //     totalDistanceSwiped = 0;
                //     this.disableTransition();
                // }));
            });
        } else {
            this.disableTransition();
            this.setPosition(0);

            items.forEach((item, index) => {
                item.setPosition(this._width * index * -1);
                item.setzIndex(items.length - index);
            });
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.fade && !changes.fade.firstChange) {
            this.fade = changes.fade.currentValue;
            if (!this.fade) {
                this.items.forEach((item, itemIndex) => item.setPosition(0));

                this.enableTransition();
                this.setPosition(this._width * this.currentItemIndex * -1);
            } else {
                this.disableTransition();
                this.setPosition(0);

                this.items.forEach((item, index) => item.setPosition(this._width * index * -1));
            }
        }
        this.cd.detectChanges();
    }

    to(index: number) {
        if (index < this.firstItemIndex || index > this.lastItemIndex) { return; }
        if (!this.fade) {
            this.slideTo(index);
        } else {
            this.fadeTo(index);
        }
    }

    prev() {
        this.to((this.currentItemIndex - 1 >= 0) ? this.currentItemIndex - 1 : this.lastItemIndex);
    }

    next() {
        this.to((this.currentItemIndex + 1 <= this.lastItemIndex) ? this.currentItemIndex + 1 : 0);
    }

    private slideTo(index: number) {
        this.currentItemIndex = index;
        this.videoChange(index);
        this.setPosition(this._width * index * -1);
        this.change.emit(index);
    }

    private videoChange(index) {
        if (this.items) {
            this.items.forEach((item, i) => {
                if (item.lazyLoadedImages) {
                    item.lazyLoadedImages.forEach((itemLazy: any, iLaze) => {
                        if (
                            itemLazy.el && itemLazy.el.nativeElement &&
                            itemLazy.el.nativeElement.tagName === 'IFRAME' &&
                            itemLazy.el.nativeElement.src) {
                            itemLazy.el.nativeElement.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                        }
                    });
                }
            });
        }
    }

    private fadeTo(index: number) {
        const currentItem = this.getItemByIndex(this.currentItemIndex);
        const targetItem = this.getItemByIndex(index);
        targetItem.setzIndex(currentItem.zIndex + 1);
        targetItem.fadeIn(this.speed);
        this.currentItemIndex = index;
        this.videoChange(index);
        this.change.emit(index);
    }

    private getItemByIndex(index: number) {
        return this.items.find((item, i) => i === index);
    }

    private disableTransition() {
        this.renderer.removeStyle(this.el.nativeElement, 'transition');
        this.renderer.removeStyle(this.el.nativeElement, '-moz-transition');
        this.renderer.removeStyle(this.el.nativeElement, '-webkit-transition');
        this.renderer.removeStyle(this.el.nativeElement, '-o-transition');
        this.renderer.removeStyle(this.el.nativeElement, '-ms-transition');
    }

    private enableTransition() {
        this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform');
        this.renderer.setStyle(this.el.nativeElement, '-moz-transition', 'transform');
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transition', 'transform');
        this.renderer.setStyle(this.el.nativeElement, '-o-transition', 'transform');
        this.renderer.setStyle(this.el.nativeElement, '-ms-transition', 'transform');

        this.renderer.setStyle(this.el.nativeElement, 'transition-duration', this.speed + 'ms');
        this.renderer.setStyle(this.el.nativeElement, '-moz-transition-duration', this.speed + 'ms');
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transition-duration', this.speed + 'ms');
        this.renderer.setStyle(this.el.nativeElement, '-o-transition-duration', this.speed + 'ms');
        this.renderer.setStyle(this.el.nativeElement, '-ms-transition-duration', this.speed + 'ms');
    }


    private setPosition(position: number) {
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translate3d(' + position + 'rem, 0, 0)');
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transform', 'translate3d(' + position + 'rem, 0, 0)');
        this.renderer.setStyle(this.el.nativeElement, '-moz-transform', 'translate3d(' + position + 'rem 0, 0)');
        this.renderer.setStyle(this.el.nativeElement, '-o-transform', 'translate3d(' + position + 'rem, 0, 0)');
        this.renderer.setStyle(this.el.nativeElement, '-ms-transform', 'translate3d(' + position + 'rem, 0, 0)');
    }

    private autoPlayFunction(boolean) {
        if (this.autoPlay) {
            if (boolean) {
                this.interval = setInterval(() => {
                    this.next();
                }, this.autoPlaySpeed);
            } else {
                clearInterval(this.interval);
            }
        }
    }
}
