export class Country {
    id: number;
    name: string;
    priority: number;
    areaCodes: number[];
    iso: string;
    iso3: string;
    dialCode: string;
    flagClass: string;
    placeHolder: string;

    constructor() {
        this.id = 0;
        this.name = '';
        this.priority = 0;
        this.areaCodes = null;
        this.iso = '';
        this.iso3 = '';
        this.dialCode = '';
        this.flagClass = '';
        this.placeHolder = '';
    }
}
