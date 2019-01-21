import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, Inject,
    Input, PLATFORM_ID, Renderer2, AfterViewChecked, AfterViewInit, OnDestroy, OnChanges
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ScrollService } from '@core/services';
import { isPlatformBrowser } from '@angular/common';
import { auditTime } from 'rxjs/operators';
import { Image360 } from '@core/models';

@Component({
    moduleId: module.id,
    selector: 'app-slide360',
    templateUrl: 'slide360.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Slide360Component implements OnChanges, OnDestroy, AfterViewInit {

    constructor(
        private cd: ChangeDetectorRef,
        private elementRef: ElementRef,
        private scrollService: ScrollService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private renderer: Renderer2,
    ) { }

    public size: string;
    @HostBinding('class') class = 's360';

    @Input() image360: Image360;
    @Input() frames: number;
    @Input() enabled = true;
    @Input() playTimeout = 3000;

    public current = 0;
    public panStart: number;
    public isPlayed = false;

    private playTimer;
    private sub: Subscription = new Subscription();

    @HostListener('panstart', ['$event']) onPanStart(event: any) {
        this.panStart = event.deltaX;
    }

    @HostListener('panmove', ['$event']) move(event: any) {
        if (!this.enabled || this.isPlayed) { return; }

        event.preventDefault();
        const px = 230;

        if (event.deltaX >= this.panStart + Math.round(px / this.frames)) {
            this.panStart = event.deltaX;
            this.toPrev();
        } else if (event.deltaX <= this.panStart - Math.round(px / this.frames)) {
            this.panStart = event.deltaX;
            this.toNext();
        }
    }

    ngOnChanges(changes: any) {
        if (changes.enabled && changes.enabled.currentValue !== null && changes.enabled.currentValue !== undefined) {
            this.enabled = changes.enabled.currentValue;
            if (!this.enabled) {
                this.stop();
            }
        }
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.sub.add(this.scrollService.resize$.pipe(auditTime(50)).subscribe(() => {
                this.removeStyle();
                const height = this.elementRef.nativeElement.offsetHeight;
                const width = this.elementRef.nativeElement.offsetWidth;
                this.size = ((height > width) ? width : height) + 'px';
                this.setStyle(this.size);
                this.cd.detectChanges();
            }));
        }
    }

    private removeStyle() {
        this.renderer.removeStyle(this.elementRef.nativeElement, 'width');
        this.renderer.removeStyle(this.elementRef.nativeElement, 'min-width');
        this.renderer.removeStyle(this.elementRef.nativeElement, 'max-width');
        this.renderer.removeStyle(this.elementRef.nativeElement, 'height');
        this.renderer.removeStyle(this.elementRef.nativeElement, 'min-height');
        this.renderer.removeStyle(this.elementRef.nativeElement, 'max-height');
    }

    private setStyle(size) {
        this.renderer.setStyle(this.elementRef.nativeElement, 'width', size);
        this.renderer.setStyle(this.elementRef.nativeElement, 'min-width', size);
        this.renderer.setStyle(this.elementRef.nativeElement, 'max-width', size);
        this.renderer.setStyle(this.elementRef.nativeElement, 'height', size);
        this.renderer.setStyle(this.elementRef.nativeElement, 'min-height', size);
        this.renderer.setStyle(this.elementRef.nativeElement, 'max-height', size);
    }

    ngOnDestroy() {
        this.stop();
        this.sub.unsubscribe();
    }

    private toPrev() {
        if (this.current - 1 >= 0) { this.current--; } else { this.current = this.frames - 1; }
        this.cd.detectChanges();
    }

    private toNext() {
        if (this.current + 1 < this.frames) { this.current++; } else { this.current = 0; }
        this.cd.detectChanges();
    }

    play() {
        if (this.isPlayed || !this.enabled) { return; }

        this.isPlayed = true;
        this.playTimer = setInterval(() => {
            this.toNext();
        }, (this.playTimeout / this.frames));
    }

    stop() {
        if (!this.isPlayed) { return; }
        this.isPlayed = false;
        clearInterval(this.playTimer);
    }
}
