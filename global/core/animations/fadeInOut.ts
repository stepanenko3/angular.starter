// import the required animation functions from the angular animations module
import { trigger, state, animate, transition, style } from '@angular/animations';

export const fadeInOutAnimation = trigger('fadeInOutAnimation', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('.3s ease', style({ opacity: 1 }))
    ]),
    transition(':leave', [
        style({ opacity: 1 }),
        animate('.3s ease', style({ opacity: 0 }))
    ]),
]);
