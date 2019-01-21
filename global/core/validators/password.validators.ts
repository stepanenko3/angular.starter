import { AbstractControl, ValidatorFn } from '@angular/forms';

export class PasswordValidators {
    public static checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string): ValidatorFn {
        return (group: AbstractControl): { [key: string]: any } => {
            const newPasswordValue = group.get(passwordKey ? passwordKey : 'password').value;
            const newPasswordConfirmValue = group.get(passwordConfirmationKey ? passwordConfirmationKey : 'confirmPassword').value;
            const control = group.get(passwordConfirmationKey ? passwordConfirmationKey : 'confirmPassword');
            const errorId = 'mismatchedPasswords';
            if (newPasswordValue !== newPasswordConfirmValue) {
                if (!control.errors) {
                    control.setErrors({ [errorId]: true });
                } else if (!control.hasError(errorId)) {
                    control.errors[errorId] = true;
                }

                return { 'mismatchedPasswords': true };
            } else {
                if (control.errors && control.hasError(errorId)) {
                    delete control.errors[errorId];
                }
            }
            return undefined;
        };
    }
}
