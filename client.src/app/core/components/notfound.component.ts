import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { MetaService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';


@Component({
    moduleId: module.id,
    templateUrl: 'notfound.component.html',
})
export class NotFoundComponent implements OnInit, OnDestroy {

    private sub: Subscription = new Subscription();

    constructor(
        private location: Location,
        private metaService: MetaService,
        private translate: TranslateService,
    ) { }

    private setMeta() {
        this.translate.get(['META.TITLE.NOT_FOUND', 'META.DESCRIPTION.NOT_FOUND', 'META.KEYS.NOT_FOUND'])
            .pipe(take(1))
            .subscribe(res => {
                this.metaService.title = res['META.TITLE.NOT_FOUND'];
                this.metaService.desc = res['META.DESCRIPTION.NOT_FOUND'];
                this.metaService.keys = res['META.KEYS.NOT_FOUND'];
            });
    }

    ngOnInit(): void {
        this.setMeta();
        this.translate.onLangChange.subscribe(() => this.setMeta());
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    goBack(): void {
        this.location.back();
    }
}
