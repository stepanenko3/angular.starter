import { ChangeDetectorRef, Component, AfterViewInit, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BreadcrumbsService, MetaService, PreloaderService } from '@core/services';
import { Subscription } from 'rxjs/index';
import { ActivatedRoute, Router } from '@angular/router';
import { TimelineMax } from 'gsap';
import { Utils } from '@core/utils';

@Component({
    moduleId: module.id,
    templateUrl: 'static-page.component.html',
})
export class StaticPageComponent implements OnInit, AfterViewInit {

    public page: any;

    private sub: Subscription = new Subscription();

    constructor(
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private breadcrumbsService: BreadcrumbsService,
        private metaService: MetaService,
        private cd: ChangeDetectorRef,
        private preloader: PreloaderService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.sub.add(this.activatedRoute.params.subscribe(() => {
            this.page = this.activatedRoute.snapshot.data['page'];

            if (!this.page) {
                this.router.navigate(['/404'], { skipLocationChange: true });
            } else {
                this.metaService.title = this.page.meta_title;
                this.metaService.desc = this.page.meta_desc;
                this.metaService.keys = this.page.meta_key;

                this.breadcrumbsService.data = [
                    { name: 'BREADCRUMBS.HOME', link: '/' },
                    { name: this.page.title, link: '' }
                ];

                this.cd.detectChanges();
            }
        }));
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
