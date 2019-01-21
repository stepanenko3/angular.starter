import { trigger, state, animate, transition, style } from '@angular/animations';

export const fieldErrorAnimation =
    trigger('fieldErrorAnimation', [
        state('void', style({})),
        transition(':enter', [
            style({ height: 0, opacity: 0, paddingTop: 0 }),
            animate('.2s', style({ height: '*', opacity: 1, paddingTop: '*' }))
        ]),
        transition(':leave', [
            style({ height: '*', opacity: 1, paddingTop: '*' }),
            animate('.2s', style({ height: 0, opacity: 0, paddingTop: 0 }))
        ])
    ]);
