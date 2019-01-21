import { Directive, HostListener, ElementRef, Renderer2, Output, EventEmitter, OnInit } from '@angular/core';

const ZERO = 0.000000000001;

@Directive({
    selector: '[appSwiper]',
    exportAs: 'swiper'
})
export class SwiperDirective implements OnInit {

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) { }

    static canISwipe = true;
    isDown = false;
    initialPos: number = ZERO;
    lastPos: number = ZERO;
    swipeDistance: number = ZERO;
    firstSwipeDate = Date.now();

    @Output() swipeRightEvent = new EventEmitter<any>();
    @Output() swipeLeftEvent = new EventEmitter<any>();
    @Output() swipeStartEvent = new EventEmitter<any>();
    @Output() swipeEndEvent = new EventEmitter<any>();
    @Output() swipeLeft = new EventEmitter<any>();
    @Output() swipeRight = new EventEmitter<any>();


    ngOnInit() {
        this.swipeEndEvent.subscribe(() => {

        });

        this.swipeLeft.subscribe(() => {
            SwiperDirective.canISwipe = false;
            setTimeout(() => {
                SwiperDirective.canISwipe = true;
            }, 350);
        });
        this.swipeRight.subscribe(() => {
            SwiperDirective.canISwipe = false;
            setTimeout(() => {
                SwiperDirective.canISwipe = true;
            }, 350);
        });
    }


    @HostListener('mousedown', ['$event'])
    onMouseDown(event: any) {
        if (!SwiperDirective.canISwipe) {
            return;
        }
        this.firstSwipeDate = Date.now();
        this.isDown = true;
        this.initialPos = event.clientX;
        this.swipeDistance = 0;
        this.swipeStartEvent.emit();
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: any) {
        if (!this.isDown) {
            return;
        }
        this.initialPos = this.lastPos = ZERO;
        this.isDown = false;

        if (this.swipeDistance > 100) {
            this.swipeLeft.emit();
        } else if (this.swipeDistance < -100) {
            this.swipeRight.emit();
        } else {
            this.swipeEndEvent.emit();
        }
        this.swipeDistance = ZERO;
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: any) {
        if (this.isDown) {
            const swipeFrameDistance = event.clientX - this.initialPos - this.lastPos;
            this.swipeDistance += swipeFrameDistance;
            this.lastPos = event.clientX - this.initialPos;

            if (swipeFrameDistance > 0) {
                this.swipeLeftEvent.emit(swipeFrameDistance);
            } else {
                this.swipeRightEvent.emit(swipeFrameDistance);
            }
        }
    }

    @HostListener('touchmove', ['$event'])
    onTouchMove(event: any) {
        if (!SwiperDirective.canISwipe) {
            return;
        }
        const touch = event.touches[0] || event.changedTouches[0];
        let swipeFrameDistance = touch.clientX - this.initialPos - this.lastPos;
        swipeFrameDistance = swipeFrameDistance < 30 ? swipeFrameDistance : 30;
        this.swipeDistance += swipeFrameDistance;
        this.lastPos = touch.clientX - this.initialPos;

        if (swipeFrameDistance > 0) {
            this.swipeLeftEvent.emit(swipeFrameDistance);
        } else {
            this.swipeRightEvent.emit(swipeFrameDistance);
        }
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: any) {
        if (!SwiperDirective.canISwipe) {
            return;
        }
        const touch = event.touches[0] || event.changedTouches[0];
        this.firstSwipeDate = Date.now();
        this.initialPos = touch.clientX;
        this.swipeDistance = ZERO;
        this.swipeStartEvent.emit();
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(event: any) {
        this.initialPos = this.lastPos = ZERO;
        if (this.swipeDistance > 100) {
            this.swipeLeft.emit();
        } else if (this.swipeDistance < -100) {
            this.swipeRight.emit();
        } else {
            this.swipeEndEvent.emit();
        }
        this.swipeDistance = ZERO;
    }

}
