import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostListener,
    OnInit,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';
import { routerTransition } from '@core/animations';
import { TranslateService } from '@ngx-translate/core';
import { Token } from '@core/models';
import { combineLatest } from 'rxjs';
import { TimelineMax } from 'gsap';

import { SwUpdate, SwPush } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';
import { take } from 'rxjs/operators';
import { ApiService, AuthService, PreloaderService } from '@core/services';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    animations: [routerTransition],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
    public catalogState = false;
    public headerPinned = false;
    public authModalState = false;
    public auth: boolean;
    public tl: TimelineMax;

    private progressRef: NgProgressRef;

    @HostListener('window:message', ['$event'])
    onMessage(e) {
        if (e.data.for && e.data.for === 'userSocialAuth') {
            this.authService.startAuthWithProvider();
            this.authService.loginWithProvider(e.data.provider, e.data.code).subscribe(res => {
                this.authService.endAuthWithProvider();
                this.authService.set(res);
            }, () => this.authService.endAuthWithProvider(), () => this.authService.endAuthWithProvider());
        }
    }

    constructor(
        private api: ApiService,
        private authService: AuthService,
        private router: Router,
        private preloaderService: PreloaderService,
        private location: Location,
        private progress: NgProgress,
        private cd: ChangeDetectorRef,
        private translate: TranslateService,
        private swUpdate: SwUpdate,
        private swPush: SwPush,
        private snackBar: MatSnackBar,
    ) {
        translate.addLangs(['en', 'ru']);
        translate.setDefaultLang('ru');

        if (!localStorage.getItem('lang')) {
            const browserLang = translate.getBrowserLang();
            translate.use(browserLang.match(/en|ru/) ? browserLang : 'en');
        } else {
            translate.use(localStorage.getItem('lang'));
        }

        // if (!localStorage.getItem('cookieConfirm')) {
        //     localStorage.setItem('cookieConfirm', '1');
        //     this.translate.get(['COOKIES.MESSAGE', 'COOKIES.BUTTON'])
        //         .pipe(take(1))
        //         .subscribe(r => {
        //             const snackbar = this.snackBar.open(r['COOKIES.MESSAGE'], r['COOKIES.BUTTON']);
        //             // snackbar.onAction().pipe(take(1)).subscribe(() => localStorage.setItem('cookieConfirm', '1'));
        //         });
        // }

        this.swUpdate.available.subscribe((event) => {
            this.swUpdate.activateUpdate().then(() => document.location.reload());
        });

        // this.api.logout$.subscribe(() => this.authService.logout());

        console.log(this.swPush.isEnabled);

        // this.swPush.requestSubscription({
        //     serverPublicKey: 'BLB',
        // }).then(sub => {
        //     console.log('subscribe', sub);
        // this.pushService.addSubscriber(sub).subscribe(res => {
        //     console.log('[App] Add subscriber request answer', res);
        //     let snackBarRef = this.snackBar.open('Now you are subscriber', null, {
        //         duration: 3000
        //     });
        // }, err => {
        //     console.log('[App] Add subscriber request failed', err)
        // })
        // }).catch(err => {
        //     console.log(err);
        // });

        // this.auth = this.authService.auth;

        // combineLatest(
        //     this.authService.modal$,
        //     this.authService.auth$
        // ).subscribe((res: any[]) => {
        //     this.authModalState = res[4];
        //     this.auth = res[5];

        //     this.cd.markForCheck();
        // });

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
