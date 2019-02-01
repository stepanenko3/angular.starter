import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';
import { routerTransition } from '@core/animations/routerTransition';
import { TimelineMax } from 'gsap';
import {PreloaderService } from '@core/services/preloader.service';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    animations: [routerTransition],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
    public tl: TimelineMax;
    private progressRef: NgProgressRef;

    constructor(
        private router: Router,
        private preloaderService: PreloaderService,
        private location: Location,
        private progress: NgProgress,
    ) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.preloaderService.loaded && this.tl) {
                    this.tl.addPause(.5).restart();
                }

                this.progressRef.start();
            } else if (event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel) {
                if (this.preloaderService.loaded && this.tl) {
                    this.tl.removePause(.5).play();
                }

                this.preloaderService.stop();
                this.progressRef.complete();

                if (event instanceof NavigationError) {
                    this.router.navigate(['/404'], { skipLocationChange: true })
                        .then(() => this.location.go(event.url));
                }
            }
        });
    }

    ngOnInit() {
        this.progressRef = this.progress.ref();
    }

    public getState(outlet) {
        return outlet.activatedRouteData.state;
    }
}
