import { Pipe, PipeTransform, EventEmitter, OnDestroy } from '@angular/core';
import { TranslateService, LangChangeEvent, DefaultLangChangeEvent } from '@ngx-translate/core';

@Pipe({
    name: 'translit',
    pure: false
})
export class TranslitPipe implements PipeTransform, OnDestroy {
    value = '';

    onLangChange: EventEmitter<LangChangeEvent>;
    onDefaultLangChange: EventEmitter<DefaultLangChangeEvent>;

    constructor(
        private translate: TranslateService,
    ) { }

    updateValue(value: string) {
        if (this.translate.currentLang === this.translate.getDefaultLang()) {
            this.value = value;
        } else {
            const arr = {
                'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'g', 'з': 'z', 'и': 'i',
                'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's',
                'т': 't', 'у': 'u', 'ф': 'f', 'ы': 'i', 'э': 'e', 'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G',
                'Д': 'D', 'Е': 'E', 'Ж': 'G', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
                'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Ы': 'I',
                'Э': 'E', 'ё': 'yo', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ь': '',
                'ю': 'yu', 'я': 'ya', 'Ё': 'YO', 'Х': 'H', 'Ц': 'TS', 'Ч': 'CH', 'Ш': 'SH', 'Щ': 'SHCH', 'Ъ': '',
                'Ь': '', 'Ю': 'YU', 'Я': 'YA'
            };

            const replacer = (a) => arr[a] || a;
            this.value = value.replace(/[А-яёЁ]/g, replacer);
        }
    }

    transform(value: string): any {
        this.updateValue(value);

        this._dispose();

        // if (!this.onLangChange) {
        //     this.onLangChange = this.translate.onLangChange.subscribe(() => {
        //         this.updateValue(value);
        //     });
        // }

        // subscribe to onDefaultLangChange event, in case the default language changes
        // if (!this.onDefaultLangChange) {
        //     this.onDefaultLangChange = this.translate.onDefaultLangChange.subscribe(() => {
        //         this.updateValue(value);
        //     });
        // }

        return this.value;
    }

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
