import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { Currency } from '../models';
import { take } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable()
export class CurrencyService {
    private storage = localStorage;
    private _current: Currency;
    private _currencies: Currency[];

    private subjectCurrent: Subject<Currency>;
    private subject: Subject<Currency[]>;

    constructor(private http: ApiService) {
        this._current = { code: null, symbol: null, rate: null, locale: null };
        this._currencies = [this._current];

        this.subjectCurrent = new BehaviorSubject<Currency>(this._current);
        this.subject = new BehaviorSubject<Currency[]>(this._currencies);
    }

    get current(): Currency {
        return this._current;
    }

    get current$(): Observable<Currency> {
        return this.subjectCurrent.asObservable();
    }

    public setCurrent(code: string) {
        let currency: Currency;
        if (code) {
            currency = this.get(code.toLocaleUpperCase());
        } else {
            currency = this.default;
        }
        if (!currency) { currency = this.default; }
        if (currency) {
            this.storage.setItem('currency', currency.code);
            this._current = currency;
            this.subjectCurrent.next(this._current);
        }
    }

    set currencies(currencies: Currency[]) {
        this._currencies = currencies;
        this.subject.next(currencies);
    }

    get currencies(): Currency[] {
        return this._currencies;
    }

    get currencies$(): Observable<Currency[]> {
        return this.subject.asObservable();
    }

    get default(): Currency {
        return this._currencies.find(i => !!i.default === true);
    }

    get(code: string): Currency {
        return this._currencies.find(i => i.code === code);
    }

    has(code: string): boolean {
        return !!this.get(code);
    }

    load() {
        return this.http.get('app/currencies').pipe(take(1));
    }
}
