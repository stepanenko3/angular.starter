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
    ScrollToService,
    MetaService,
    BreadcrumbsService,
    ScrollService,
    PreloaderService,
    ConfigService
} from '@core/services';
import { TimelineMax, Back } from 'gsap';
import { Utils } from '@core/utils';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
    constructor(private route: ActivatedRoute,
        private metaService: MetaService,
        private breadcrumbsService: BreadcrumbsService,
        private scrollService: ScrollService,
        private cd: ChangeDetectorRef,
        private config: ConfigService,
        private translate: TranslateService,
        private scrollToService: ScrollToService,
        private preloader: PreloaderService, ) {
    }

    public isMobile: boolean;

    public h1: string;
    public text: string;

    private sub: Subscription = new Subscription();

    public addZeros(number): string {
        return Utils.addZeros(number, 2);
    }

    ngOnInit(): void {
        this.h1 = this.textToChars('Магазин техники Apple');
        this.text = this.textToChars(
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
            + 'Ad aspernatur atque beatae deserunt dolores doloribus eius exercitationem hic,'
            + 'incidunt laboriosam natus odit officia perspiciatis quae reprehenderit saepe sed suscipit ullam.'
        );

        this.setMeta();
        this.sub.add(this.translate.onLangChange.subscribe(() => this.setMeta()));

        this.breadcrumbsService.data = [{ name: 'BREADCRUMBS.HOME', link: '/' }];

        this.sub.add(this.scrollService.resize$.subscribe(() => {
            this.isMobile = window.innerWidth <= 768;
            this.cd.detectChanges();
        }));
    }

    private setMeta() {
        this.translate.get(['META.TITLE.HOME', 'META.DESCRIPTION.HOME', 'META.KEYS.HOME'])
            .pipe(take(1))
            .subscribe(res => {
                this.metaService.title = res['META.TITLE.HOME'];
                this.metaService.desc = res['META.DESCRIPTION.HOME'];
                this.metaService.keys = res['META.KEYS.HOME'];
            });
    }

    public textToChars(text: string): string {
        return Utils.textToChars(text);
    }

    ngAfterViewInit() {
        this.scrollToService.scrollToPos(0);

        if (this.preloader.loaded) {
            this.doAnimate();
        } else {
            this.sub.add(this.preloader.loaded$.subscribe(() => this.doAnimate()));
        }
    }

    private doAnimate() {
        const tl = new TimelineMax();
        tl
            .staggerFrom('.enter-screen__title .letter', .5, { y: 15, opacity: 0 }, .075, 0)
            .staggerFrom('.enter-screen__text .letter', .5, { y: 15, opacity: 0 }, .015, 0)
            .from('.enter-screen__circle', .9, { scale: .1, y: '-50%', opacity: 0, ease: Back.easeOut.config(1.7) }, .65);
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
