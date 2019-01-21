import { ChangeDetectorRef, Inject, Injectable, LOCALE_ID, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { equals } from '@core/utils';
import { CurrencyService } from '@core/services';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { Currency } from '@core/models';

@Injectable()
@Pipe({
    name: 'iCurrency',
    pure: false
})
export class ICurrencyPipe implements PipeTransform, OnDestroy {
    value = '';

    currency: Currency;
    defCurrency: Currency;

    lastValue: any;
    lastCurrency: Currency;
    lastDefCurrency: Currency;
    lastDigits: string;
    lastLocale: string;

    onCurrencyChange: Subscription;

    constructor(
        private currencyService: CurrencyService,
        @Inject(LOCALE_ID) private _locale: string,
        private cd: ChangeDetectorRef
    ) { }

    updateValue(
        value: any,
        digits: string = '1.2-2',
        locale: string
    ): void {
        locale = locale || this.currency.locale || this._locale;

        let number;
        if (!this.currency.code || !this.currency.rate || !this.defCurrency) {
            number = new DecimalPipe(locale).transform(value, digits);
        } else {
            number = new CurrencyPipe(locale)
                .transform(
                    (this.defCurrency.rate * parseFloat(value) / this.currency.rate),
                    this.currency.symbol ? this.currency.symbol : this.currency.code,
                    this.currency.symbol ? 'code' : 'symbol-narrow',
                    digits
                );
        }

        if (number.indexOf('.') !== -1) {
            const _v = number.split('.');
            this.value = _v[0] + `<span>.${_v[1]}</span>`;
        } else if (number.indexOf(',') !== -1) {
            const _v = number.split(',');
            this.value = _v[0] + `<span>,${_v[1]}</span>`;
        } else {
            const symbol = new CurrencyPipe(locale)
                .transform(0, this.currency.code, 'symbol-narrow', '1.0-2')
                .replace(/[0-9]/g, '');

            this.value = number.replace(symbol, `<span>${symbol}</span>`);
        }
        this.cd.detectChanges();
    }

    transform(
        value: any,
        currency: Currency,
        defCurrency: Currency,
        digits: string = '1.2-2',
        locale: string,
    ): any {
        if (!value || value.length === 0) { return value; }

        if (
            equals(value, this.lastValue) &&
            equals(currency, this.lastCurrency) &&
            equals(defCurrency, this.lastDefCurrency) &&
            equals(digits, this.lastDigits) &&
            equals(locale, this.lastLocale)
        ) { return this.value; }

        this.lastValue = value;
        this.lastCurrency = currency;
        this.lastDefCurrency = defCurrency;
        this.lastDigits = digits;
        this.lastLocale = locale;

        this.defCurrency = defCurrency ? defCurrency : this.currencyService.default;
        this.currency = currency ? currency : this.currencyService.current;

        this.updateValue(value, digits, locale);

        this._dispose();

        if (!this.onCurrencyChange && !this.lastCurrency) {
            this.onCurrencyChange = this.currencyService.current$.subscribe(c => {
                this.currency = c;
                this.updateValue(
                    this.lastValue,
                    this.lastDigits,
                    this.lastLocale
                );
            });
        }

        return this.value;
    }

    private _dispose(): void {
        if (typeof this.onCurrencyChange !== 'undefined') {
            this.onCurrencyChange.unsubscribe();
            this.onCurrencyChange = undefined;
        }
    }

    ngOnDestroy(): void {
        this._dispose();
    }
}
