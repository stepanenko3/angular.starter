import { animate, group, query, style, transition, trigger } from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
    transition('* <=> *', [
        style({
            opacity: 0,
            // transform: 'translate3d(0,-1rem,0)',
            zIndex: 10,
            // filter: 'blur(5px)'
        }),
        animate('600ms 200ms ease', style({
            opacity: 1,
            // transform: 'translate3d(0,0,0)',
            // filter: 'blur(0)'
        })),
    ]),
]);
