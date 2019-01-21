// import the required animation functions from the angular animations module
import { trigger, state, animate, transition, style } from '@angular/animations';

export const blurInOutAnimation = trigger('blurInOutAnimation', [
    transition(':enter', [
        style({
            opacity: 0,
            filter: 'blur(15px)'
        }),
        animate('.35s ease-in-out', style({
            opacity: 1,
            filter: 'blur(0)'
        }))
    ]),
    transition(':leave', [
        style({
            opacity: 1,
            filter: 'blur(0)'
        }),
        animate('.35s ease-out', style({
            opacity: 0,
            filter: 'blur(15px)'
        }))
    ]),
]);
