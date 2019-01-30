import {
    Component,
    Inject,
    OnDestroy,
    OnInit,
    PLATFORM_ID
} from '@angular/core';
import { Subscription } from 'rxjs';

import { TimelineMax } from 'gsap';
import { HeaderService } from '../../services';
import { PreloaderService } from '@core/services';

@Component({
    moduleId: module.id,
    selector: 'app-header',
    templateUrl: 'header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
    public front: boolean;
    public project;

    private sub: Subscription = new Subscription();

    constructor(
        private headerService: HeaderService,
        private preloader: PreloaderService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
    }

    ngOnInit() {
        this.sub.add(this.headerService.front$.subscribe(front => this.front = front));
        this.sub.add(this.headerService.project$.subscribe(project => this.project = project));

        let animated = false;
        this.sub.add(this.preloader.loaded$.subscribe(() => {
            if (!animated) {
                animated = true;

                const tl = new TimelineMax();
                tl.from('.header', .75, {y: -30, opacity: 0}, .3);
            }
        }));
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
