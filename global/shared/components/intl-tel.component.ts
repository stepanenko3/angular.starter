import { Component, Input, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'google-libphonenumber';
import { Country } from '@core/models/country';
import { GeoService } from '@core/services';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';

const phoneUtil = _.PhoneNumberUtil.getInstance();
const pnf = _.PhoneNumberFormat;

@Component({
    selector: 'app-intl-tel',
    templateUrl: './intl-tel.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => IntlTelComponent),
        multi: true
    }],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntlTelComponent implements OnInit, OnDestroy {

    @Input() inputId: string;
    @Input() defaultCountry: string;
    @Input() disabled = false;
    @Input() preferredCountries: Array<string> = ['ua'];
    @Input() allowDropDown = true;

    public value = '';
    public phone_number = '';
    public allCountries: Array<Country> = [];
    public preferredCountriesInDropDown: Array<Country> = [];
    public selectedCountry: Country = new Country();

    private sub: Subscription = new Subscription();

    constructor(
        private geoService: GeoService,
        private cd: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.fetchCountryData();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onChange: Function = (value: any) => { };
    onTouched: Function = () => { };

    registerOnChange(callback: (change: any) => void): void {
        this.onChange = callback;
    }

    registerOnTouched(callback: () => void): void {
        this.onTouched = callback;
    }

    writeValue(value: string) {
        this.value = value;

        if (this.selectedCountry.iso) {
            this.testCountry(value);
            this.phone_number = this.formatPhone(value, this.selectedCountry.iso);
        }

        this.cd.detectChanges();
    }

    public onPhoneNumberChange(): void {
        this.onTouched();

        if (this.phone_number.length > 0) {
            this.testCountry(this.phone_number);
            this.value = this.formatPhone(this.phone_number, this.selectedCountry.iso);
            this.onChange(this.value);
            this.cd.detectChanges();
        }
    }

    public onCountrySelect(country: Country, el): void {
        this.onTouched();
        this.selectedCountry = country;
        if (this.phone_number.length > 0) {
            try {
                const phoneNumber = phoneUtil.parse(this.phone_number, country.iso);

                this.phone_number = this.formatPhone(
                    '+' + country.dialCode + phoneNumber.getNationalNumber(),
                    country.iso,
                );

                this.value = this.phone_number;
                this.onChange(this.value);
            } catch (e) { }
        }
        el.focus();
        this.cd.detectChanges();
    }

    public onInputKeyPress(event): void {
        const pattern = /[0-9\+\-\ ]/;
        const inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }


    private fetchCountryData(): void {
        this.sub.add(this.geoService.countries$.subscribe((countries: Country[]) => {
            countries.map((c: Country) => {
                const country = new Country();
                country.id = c.id;
                country.name = c.name;
                country.iso = c.iso;
                country.dialCode = c.dialCode;
                country.priority = c.priority;
                country.areaCodes = c.areaCodes;
                country.flagClass = c.iso.toLocaleLowerCase();
                country.placeHolder = this.formatPhone('661234567', c.iso.toUpperCase());
                this.allCountries.push(country);
            });

            if (this.preferredCountries.length) {
                this.preferredCountries.forEach(iso => {
                    const preferredCountry = this.allCountries.filter((c) => {
                        return c.iso === iso;
                    }).sort((a, b) => b.priority - a.priority);
                    this.preferredCountriesInDropDown.push(preferredCountry[0]);
                });
            }

            if (this.preferredCountriesInDropDown.length) {
                this.selectedCountry = this.preferredCountriesInDropDown[0];
            } else {
                this.selectedCountry = this.allCountries[0];
            }

            if (this.value) {
                this.testCountry(this.value);
                this.phone_number = this.formatPhone(this.value, this.selectedCountry.iso);
            }

            this.cd.detectChanges();
        }));
    }

    private testCountry(phone_number) {
        try {
            const number = phoneUtil.parse(phone_number, this.selectedCountry.iso);

            const countryCode = phoneUtil.getRegionCodeForNumber(number);

            if (this.selectedCountry.iso !== countryCode) {
                const phoneCountries = this.allCountries.filter((c) => {
                    return c.iso.toLocaleLowerCase() === countryCode.toLowerCase();
                }).sort((a, b) => b.priority - a.priority);

                this.selectedCountry = phoneCountries[0];
            }
        } catch (e) {
            if (phone_number) {
                const phoneNumber = phone_number.toString().replace('+', '');
                const phoneCountries = this.allCountries.filter((c) => {
                    return c.dialCode.toLocaleLowerCase() === phoneNumber.toLowerCase();
                }).sort((a, b) => b.priority - a.priority);

                if (phoneCountries.length) { this.selectedCountry = phoneCountries[0]; }
            }
        }
    }

    private formatPhone(phone: string, countryCode: string, format = pnf.INTERNATIONAL): string {
        try {
            const phoneNumber = phoneUtil.parse(phone, countryCode);
            return phoneUtil.format(phoneNumber, format);
        } catch (e) {
            return phone;
        }
    }
}
