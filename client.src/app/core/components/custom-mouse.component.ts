import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, OnDestroy, ElementRef
} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'app-custom-mouse',
    template: `
        <div class="custom-mouse" [class.visible]="visible" [class.down]="down"
            [class.clickable-cursor]="clickableCursor" [class.external-link]="externalLink" [style.transform]="transform">
            <div class="i"></div>
            <div class="e">
                <div class="inline-svg">
                    <svg viewBox="0 0 59.8 59.8">
                        <path d="M29.9 0C13.4 0 0 13.4 0 29.9s13.4 29.9 29.9 29.9 29.9-13.4
                        29.9-29.9S46.4 0 29.9 0zm5.5 33.5h-2.5v-4.8l-6.6 6.6-1.8-1.8 6.6-6.5h-4.7v-2.5h9v9z"></path>
                    </svg>
                </div>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomMouseComponent {

    visible = false;
    transform = 'matrix(1, 0, 0, 1, 0, 0)';
    clickableCursor = false;
    externalLink = false;
    down = false;

    @HostListener('window:mousemove', ['$event'])
    onMousemove(event) {
        let externalLink = event.target.getAttribute('target') === '_blank';
        let clickableCursor =
            event.target.tagName.toLowerCase() === 'a' ||
            (event.target.style ? window.getComputedStyle(event.target, null).cursor : '') === 'pointer';

        event.path.forEach(el => {
            if (el.tagName && el.tagName.toLowerCase() === 'a') {
                externalLink = el.getAttribute('target') === '_blank';
                clickableCursor = true;
            }

            if ((el.style ? window.getComputedStyle(el, null).cursor : '') === 'pointer') {
                clickableCursor = true;
            }
        });
        this.externalLink = externalLink;
        this.clickableCursor = clickableCursor && !externalLink;
        this.transform = 'matrix(1, 0, 0, 1, ' + event.clientX + ', ' + event.clientY + ')';
    }

    @HostListener('document:mouseenter')
    onMouseenter() {
        this.visible = true;
    }

    @HostListener('document:mouseleave')
    onMouseleave() {
        this.visible = false;
    }

    @HostListener('document:mousedown')
    onMousedown() {
        this.down = true;
    }

    @HostListener('document:mouseup')
    onMouseup() {
        this.down = false;
    }
}
