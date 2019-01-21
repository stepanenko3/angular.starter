import { trigger, animate, transition, style, query, group } from '@angular/animations';

export const dropdownContent =
    trigger('dropdownContent', [
        transition('* <=> *', [
            style({
                position: 'relative'
            }),
            query(':enter', style({
                position: 'absolute',
            }), { optional: true }),

            group([
                query(':leave', [
                    style({
                        position: 'relative',
                        transform: 'translate3d(0, 0, 0)',
                        opacity: 1
                    }),
                    animate('300ms ease', style({
                        transform: 'translate3d(-1rem, 0, 0)',
                        opacity: 0,
                    })),
                    animate('1ms', style({
                        position: 'absolute'
                    }))
                ], { optional: true }),

                query(':enter', [
                    style({
                        transform: 'translate3d(1rem, 0, 0)',
                        opacity: 0
                    }),
                    animate('1ms 301ms', style({
                        position: 'relative'
                    })),
                    animate('300ms 301ms ease', style({
                        transform: 'translate3d(0, 0, 0)',
                        opacity: 1
                    }))
                ], { optional: true }),
            ])
        ])
    ]);
