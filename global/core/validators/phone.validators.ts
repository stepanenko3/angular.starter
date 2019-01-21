import { FormControl } from '@angular/forms';

import * as _ from 'google-libphonenumber';
const phoneUtil = _.PhoneNumberUtil.getInstance();

export class PhoneValidators {
    public static checkIfValidPhone(control: FormControl): { [key: string]: any } {
        const phoneValue = control.value;
        const errorId = 'invalidPhone';

        try {
            const number = phoneUtil.parseAndKeepRawInput(phoneValue, 'UA');
            if (!phoneUtil.isValidNumber(number)) {
                return { [errorId]: true };
            }
        } catch (e) {
            return { [errorId]: true };
        }

        return null;
    }
}
