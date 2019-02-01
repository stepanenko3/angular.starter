import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import {
    PreloaderService,
} from '@core/services/preloader.service';
import { TimelineMax, Back } from 'gsap';
import { Utils } from '@core/utils';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { ProjectService, HeaderService } from '@client/core/services';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
    constructor(
        private cd: ChangeDetectorRef,
        private headerService: HeaderService,
        private preloader: PreloaderService,
        private projectService: ProjectService) {
    }

    public isMobile: boolean;

    public text1: string;
    public text2: string;
    public text3: string;

    public projectsLoading = true;
    public projects: any[];

    private sub: Subscription = new Subscription();

    public addZeros(number): string {
        return Utils.addZeros(number, 2);
    }

    ngOnInit(): void {
        this.headerService.front = true;

        this.text1 = this.textToChars('Artem');
        this.text2 = this.textToChars('Stepanenko');
        this.text3 = this.textToChars('22 y.o. Developer from Kiev, Ukraine');

        this.sub.add(this.projectService.getProjects().subscribe(projects => {
            this.projectsLoading = false;
            this.projects = projects;
            this.cd.detectChanges();
        }));
    }

    public textToChars(text: string): string {
        return Utils.textToChars(text);
    }

    ngAfterViewInit() {
        if (this.preloader.loaded) {
            this.doAnimate();
        } else {
            this.sub.add(this.preloader.loaded$.subscribe(() => this.doAnimate()));
        }
    }

    private doAnimate() {
        const tl = new TimelineMax();
        tl
        .staggerFrom('.s01__header .letter', .6, { y: 26, opacity: 0 }, .07, .75)
        .from('.s01__animation', .9, { opacity: 0, x: 50 }, 1)
        .staggerFrom('.s01__text .letter', .4, { y: 5, opacity: 0 }, .02, '-=0.6')
        .from('.s01 .contact-me', .3, { y: 10, opacity: 0 }, '-=0.4');
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
        this.headerService.front = false;
    }
}
