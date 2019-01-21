import { Injectable, EventEmitter } from '@angular/core';
import { TimelineMax, Back } from 'gsap';

@Injectable()
export class PreloaderService {
    public loaded$: EventEmitter<boolean> = new EventEmitter();
    public loaded = false;

    stop() {
        if (!this.loaded) {

            const tl = new TimelineMax();

            tl
                .set('.prelaoder__circle', {x: '-50%', y: '-50%'}, 0)
                .fromTo('.preloader__circle', .6, {x: '-50%', y: '-50%', scale: 0}, {x: '-50%', y: '-50%', scale: 1.5 }, .15)
                .to('.preloader__circle', .3, { opacity: 0 }, '-=0.3')
                .to('.preloader__logo', .6, { y: -65, opacity: 0, ease: Back.easeIn.config(4) }, 0)
                .to('.preloader__loading', .3, {opacity: 0}, .15)
                .to('.preloader', .3, { opacity: 0, visibility: 'hidden' }, .6)
                .add(() => {
                    this.loaded = true;
                    this.loaded$.next(true);
                }, '+=0.15');
        } else {
            // this.loaded$.next(true);
        }
    }
}
