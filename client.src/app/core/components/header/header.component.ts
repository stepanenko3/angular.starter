import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    PLATFORM_ID
} from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';

import { HeaderService, MenuService } from '../../services';
import {
    ScrollToService, ScrollService, AuthService, PreloaderService
} from '@core/services';
import { isPlatformBrowser } from '@angular/common';
import { Menu, User } from '@core/models';

@Component({
    moduleId: module.id,
    selector: 'app-header',
    templateUrl: 'header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
    public black: boolean;
    public show = true;
    public pinned = false;
    public scrollTop = false;
    public isMobile = false;
    public currentUser: User;

    public menu: Menu;

    private tolerance = 150;
    private offset = 250;
    private pinnedOffset = 39;
    private scrollTopOffset = 100;

    private didScroll = true;
    private lastScrollTop = 0;
    private sub: Subscription = new Subscription();

    public searchState = false;

    constructor(
        private headerService: HeaderService,
        private authService: AuthService,
        private menuService: MenuService,
        private scrollService: ScrollService,
        private scrollToService: ScrollToService,
        private cd: ChangeDetectorRef,
        private preloader: PreloaderService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
    }

    ngOnInit() {
        let first = true;

        // this.menu = this.menuService.getByArea('top');

        if (!isPlatformBrowser(this.platformId)) {
        } else {
            this.sub.add(this.scrollService.resize$
                .subscribe(() => {
                    this.isMobile = window.innerWidth <= 768;
                    if (!first) {
                        this.cd.detectChanges();
                    }
                }));

            this.sub.add(this.scrollService.scroll$.subscribe(() => {
                //     this.didScroll = true;
                // const pinned = window.pageYOffset >= this.pinnedOffset;
                // if (this.pinned !== pinned) {
                //     this.pinned = pinned;
                //     this.headerService.pinned = this.pinned;
                //     if (!first) { this.cd.detectChanges(); }
                // }
                const scrollTop = window.pageYOffset >= this.scrollTopOffset;
                if (this.scrollTop !== scrollTop) {
                    this.scrollTop = scrollTop;
                    if (!first) {
                        this.cd.detectChanges();
                    }
                }
            }));
        }

        this.sub.add(combineLatest(
            this.headerService.black$,
            this.authService.auth$,
        ).subscribe((res: any[]) => {
            this.black = res[1];
            this.currentUser = this.authService.user;

            if (!first) {
                this.cd.detectChanges();
            }
        }));

        let animated = false;
        this.sub.add(this.preloader.loaded$.subscribe(() => {
            if (!animated) {
                animated = true;

                // let tl = new TimelineMax();
                // tl.from('.header', .75, {y: -30, opacity: 0}, .3);
            }
        }));

        this.cd.detectChanges();
        first = false;
    }

    ngAfterViewInit() {
        //     interval(100).subscribe(() => {

        //         if (this.didScroll) {
        //             this.updateHeader();
        //             this.didScroll = false;
        //         }
        //     });
    }

    // private updateHeader() {
    //     const a: number = this.scrollService.pos;

    //     let show: boolean = !!this.show;
    //     if (a < this.offset) { show = true; }

    //     if (Math.abs(this.lastScrollTop - a) >= this.tolerance) {
    //         show = a <= this.lastScrollTop;
    //         this.lastScrollTop = a;
    //         if (a < this.offset) { show = true; }
    //     }

    //     if (this.show !== show) {
    //         this.show = show;
    //         this.cd.detectChanges();
    //     }
    // }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    openAuthModal() {
        this.authService.openModal();
    }

    scrollToTop() {
        this.scrollToService.scrollToPos(0);
    }
}
