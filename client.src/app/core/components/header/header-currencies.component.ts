import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';

import { Currency } from '@core/models';
import { CurrencyService } from '@core/services';
import { Subscription } from 'rxjs';

@Component({
    moduleId: module.id,
    selector: 'app-header-currencies',
    templateUrl: 'header-currencies.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderCurrenciesComponent implements OnInit, OnDestroy {

    public current: Currency;
    public currencies: Currency[];

    private sub: Subscription = new Subscription();

    constructor(
        private currencyService: CurrencyService,
        private cd: ChangeDetectorRef,
    ) {
    }

    changeCurrency(code: string) {
        this.currencyService.setCurrent(code);
    }

    ngOnInit() {
        let first = true;
        this.current = this.currencyService.current;
        this.currencies = this.currencyService.currencies;

        this.sub.add(this.currencyService.current$.subscribe(data => {
            this.current = data;
            if (!first) {
                this.cd.detectChanges();
            }
        }));

        this.sub.add(this.currencyService.currencies$.subscribe(data => {
            this.currencies = data;
            if (!first) {
                this.cd.detectChanges();
            }
        }));

        this.cd.detectChanges();
        first = false;
    }

    trackByFn(item: Currency) {
        return item.code;
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
