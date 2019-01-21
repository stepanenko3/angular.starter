import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { StaticPageService } from '@client/core/services';

import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

const staticPageResolver = makeStateKey('staticPageResolver');

@Injectable()
export class StaticPageResolver implements Resolve<any> {

    constructor(
        private staticPageService: StaticPageService,
        private state: TransferState,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const staticPage = this.state.get(staticPageResolver, null as any);
        if (staticPage) {
            this.state.remove(staticPageResolver);
            return of(staticPage);
        } else {
            return this.staticPageService.getStaticPage(route.params['alt']).pipe(map(data => {
                if (isPlatformServer(this.platformId)) {
                    this.state.set(staticPageResolver, data as any);
                }
                return data;
            }));
        }
    }
}
