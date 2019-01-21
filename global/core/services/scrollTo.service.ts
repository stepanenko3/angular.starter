import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable()
export class ScrollToService {

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Optional() @Inject(DOCUMENT) private document: any,
    ) {
    }

    public scrollTo(element: string | HTMLElement, offset: number = 0) {
        if (typeof element === 'string' && this.document) {
            const el = this.document.querySelector(element as string);
            this.scrollToElement(el as HTMLElement, offset);
        } else if (element instanceof HTMLElement) {
            this.scrollToElement(element, offset);
        } else {
            throw new Error('I don\'t find element');
        }
    }

    public scrollToPos(position: number = 0) {
        this.doScrolling(position, 300);
    }

    private scrollToElement(el: HTMLElement, offset: number) {
        if (el) {
            this.doScrolling(el.offsetTop + offset, 300);
        } else {
            throw new Error('I don\'t find element');
        }
    }

    private doScrolling(elementY, duration) {
        if (isPlatformBrowser(this.platformId)) {
            const offset = window.pageYOffset;

            if (elementY !== offset) {
                if (offset < elementY - 50) {
                    window.scrollTo(0, elementY - 50);
                } else if (offset > elementY + 50) {
                    window.scrollTo(0, elementY + 50);
                }

                const startingY = window.pageYOffset;
                const diff = elementY - startingY;
                let start;

                window.requestAnimationFrame(function step(timestamp) {
                    start = (!start) ? timestamp : start;

                    const time = timestamp - start;
                    const percent = Math.min(time / duration, 1);

                    window.scrollTo(0, startingY + diff * percent);

                    if (time < duration) {
                        window.requestAnimationFrame(step);
                    }
                });
            }
        }
    }
}
