import { Pipe, PipeTransform, ChangeDetectorRef, EventEmitter, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'valueByLang',
    pure: false
})
export class ValueByLangPipe implements PipeTransform, OnDestroy {
    value = '';
    lastValue: any;
    lastKey: string;
    lastLang: string;

    onLangChange: EventEmitter<any>;
    onDefaultLangChange: EventEmitter<any>;

    constructor(
        private translate: TranslateService,
    ) { }

    updateValue(value: any[], key: string) {
        if (!value || typeof value !== 'object') {
            return value;
        }

        // if (equals(value, this.lastValue) && key === this.lastKey && this.lastLang === this.currentLang) {
        //     return this.value;
        // }

        this.lastValue = value;
        this.lastKey = key;

        let tmp;
        if (value.hasOwnProperty(this.translate.currentLang)) {
            tmp = value[this.translate.currentLang];
        } else if (value.hasOwnProperty(this.translate.getDefaultLang())) {
            tmp = value[this.translate.getDefaultLang()];
        } else {
            tmp = '';
        }

        if (key) {
            if (tmp || typeof tmp === 'object' && tmp.hasOwnProperty(key)) {
                this.value = tmp[key];
            } else {
                this.value = '';
            }
        } else {
            this.value = tmp;
        }
    }

    transform(value: any[], key: string = null): any {
        this.updateValue(value, key);

        this._dispose();

        if (!this.onLangChange) {
            this.onLangChange = this.translate.onLangChange.subscribe(() => {
                this.updateValue(this.lastValue, this.lastKey);
            });
        }

        // subscribe to onDefaultLangChange event, in case the default language changes
        if (!this.onDefaultLangChange) {
            this.onDefaultLangChange = this.translate.onDefaultLangChange.subscribe(() => {
                this.updateValue(this.lastValue, this.lastKey);
            });
        }

        return this.value;
    }

    /**
     * Clean any existing subscription to change events
     */
    private _dispose(): void {
        if (typeof this.onLangChange !== 'undefined') {
            this.onLangChange.unsubscribe();
            this.onLangChange = undefined;
        }
        if (typeof this.onDefaultLangChange !== 'undefined') {
            this.onDefaultLangChange.unsubscribe();
            this.onDefaultLangChange = undefined;
        }
    }

    ngOnDestroy(): void {
        this._dispose();
    }
}
