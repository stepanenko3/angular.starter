import { ChangeDetectorRef, Component, AfterViewInit, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BreadcrumbsService, MetaService, PreloaderService } from '@core/services';
import { Subscription } from 'rxjs/index';
import { ActivatedRoute, Router } from '@angular/router';
import { TimelineMax } from 'gsap';
import { Utils } from '@core/utils';
import { HeaderService } from '@client/core/services';

@Component({
    moduleId: module.id,
    templateUrl: 'project.component.html',
})
export class ProjectComponent implements OnInit, AfterViewInit {

    public responsive: string;
    public project: any;

    private sub: Subscription = new Subscription();

    constructor(
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private cd: ChangeDetectorRef,
        private preloader: PreloaderService,
        private router: Router,
        private headerService: HeaderService,
    ) { }

    ngOnInit() {
        this.sub.add(this.activatedRoute.params.subscribe(() => {
            this.project = this.activatedRoute.snapshot.data['project'];
            this.headerService.project = this.project;

            if (!this.project) {
                this.router.navigate(['/404'], { skipLocationChange: true });
            } else {
                this.cd.detectChanges();
            }
        }));

        this.sub.add(this.headerService.responsive$.subscribe(res => this.responsive = res));
    }

    ngAfterViewInit() {
        if (this.preloader.loaded) {
            this.doAnimate();
        } else {
            this.sub.add(this.preloader.loaded$.subscribe(() => this.doAnimate()));
        }
    }

    private doAnimate() {
        const tl = new TimelineMax({ delay: .5 });
        tl
            .from('.breadcrumbs', .6, { y: 15, opacity: 0 })
            .staggerFrom('.page__title .letter', .6, { y: 15, opacity: 0 }, .03, '-=0.45')
            .from('.page__text', .6, { y: 20, opacity: 0 }, .3);
    }

    textToChars(text: string): string {
        return Utils.textToChars(text);
    }

    goBack(): void {
        this.location.back();
    }
}
