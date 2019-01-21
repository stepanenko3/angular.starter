// import the required animation functions from the angular animations module
import { trigger, state, animate, transition, style } from '@angular/animations';

export const fadeOutAnimation =
    // trigger name for attaching this animation to an element using the [@triggerName] syntax
    trigger('fadeOutAnimation', [
        state('void', style({ opacity: 0 })),
        // route 'enter' transition
        transition(':leave', [

            // css styles at start of transition
            style({ opacity: 0 }),

            // animation and styles at end of transition
            animate('.45s', style({ opacity: 1 }))
        ]),
    ]);
