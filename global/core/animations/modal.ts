import { animate, group, query, state, style, transition, trigger } from '@angular/animations';

export const modalAnimation =
    trigger('modalAnimation', [

        transition(':enter', [
            style({ opacity: 0 }),

            query('.modal__content', style({
                transform: 'translate3d(0, -1.5rem, 0)',
            }), { optional: true }),

            group([
                animate('.5s cubic-bezier(.175,.885,.32,1.275)', style({ opacity: 1 })),

                query('.modal__content', animate('.5s cubic-bezier(.175,.885,.32,1.275)', style({
                    transform: 'translate3d(0, 0, 0)',
                })), { optional: true }),
            ]),
        ]),

        transition(':leave', [
            style({ opacity: 1 }),

            group([
                animate('.5s cubic-bezier(.175,.885,.32,1.275)', style({ opacity: 0 })),
            ]),
        ])
    ]);
