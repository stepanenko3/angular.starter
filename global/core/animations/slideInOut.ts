import { trigger, state, animate, transition, style } from '@angular/animations';

export const slideInOutAnimation =
    trigger('slideInOutAnimation', [
        state('void', style({ position: 'fixed', top: 0, left: 0, width: '100%' })),

        transition(':enter', [
            style({ opacity: 0, transform: 'translateX( -10% )' }),
            animate('.3s ease-in-out', style({ transform: 'translateX( 0% )', opacity: 1 }))
        ]),

        transition(':leave', [
            style({ position: 'fixed', top: 0, left: 0, transform: 'translateX( 0% )', opacity: 1, width: '100%' }),
            animate('.3s ease-in-out', style({ transform: 'translateX( 10% )', opacity: 0 }))
        ])
    ]);
