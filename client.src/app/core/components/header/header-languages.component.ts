import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
    moduleId: module.id,
    selector: 'app-header-languages',
    templateUrl: 'header-languages.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderLanguagesComponent implements OnInit, OnDestroy {

    public current: string;
    public list: string[];

    private sub: Subscription = new Subscription();

    constructor(
        private translate: TranslateService,
        private cd: ChangeDetectorRef,
    ) {
    }

    change(code: string) {
        this.translate.use(code);
        localStorage.setItem('lang', code);
    }

    ngOnInit() {
        this.current = this.translate.currentLang;
        this.list = this.translate.getLangs();

        this.sub.add(this.translate.onLangChange.subscribe(res => {
            this.current = res.lang;
            this.cd.detectChanges();
        }));
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
