// import the required animation functions from the angular animations module
import { trigger, state, animate, transition, style } from '@angular/animations';

export const fadeInAnimation = trigger('fadeInAnimation', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('.6s ease-out', style({ opacity: 1 }))
    ]),
]);
