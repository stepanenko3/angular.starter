import { FormControl, FormGroup } from '@angular/forms';

export function equals(o1: any, o2: any): boolean {
    if (o1 === o2) { return true; }
    if (o1 === null || o2 === null) { return false; }
    if (o1 !== o1 && o2 !== o2) { return true; } // NaN === NaN
    const t1 = typeof o1;
    const t2 = typeof o2;
    let length: number, key: any, keySet: any;
    if (t1 === t2 && t1 === 'object') {
        if (Array.isArray(o1)) {
            if (!Array.isArray(o2)) { return false; }
            if ((length = o1.length) === o2.length) {
                for (key = 0; key < length; key++) {
                    if (!equals(o1[key], o2[key])) { return false; }
                }
                return true;
            }
        } else {
            if (Array.isArray(o2)) {
                return false;
            }
            keySet = Object.create(null);
            for (key in o1) {
                if (!o1.hasOwnProperty(key)) {
                    continue;
                }

                if (!equals(o1[key], o2[key])) {
                    return false;
                }

                keySet[key] = true;
            }
            for (key in o2) {
                if (!(key in keySet) && typeof o2[key] !== 'undefined') {
                    return false;
                }
            }
            return true;
        }
    }
    return false;
}

export class Utils {
    public static validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    public static manageErrors(res: any, formGroup: FormGroup, callback: Function = () => { }, errorCallback: Function = () => { }) {
        if (res && !res.errors) {
            callback(res);
        } else if (res && res.errors) {
            errorCallback(res);

            for (const a in res.errors) {
                if (!res.errors.hasOwnProperty(a) || !formGroup.get(a)) {
                    continue;
                }
                formGroup.get(a).setErrors(res.errors[a]);
            }
        }
    }

    public static isRetina() {
        let mediaQuery;
        if (typeof window !== 'undefined' && window !== null) {
            mediaQuery = '(-webkit-min-device-pixel-ratio: 1.25), (min--moz-device-pixel-ratio: 1.25),'
                + '(-o-min-device-pixel-ratio: 5/4), (min-resolution: 1.25dppx)';

            if (window.devicePixelRatio > 1.25) {
                return true;
            }
            if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
                return true;
            }
        }
        return false;
    }

    public static isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    }

    public static textToChars(text: string): string {
        return text.split('')
            .map(letter => letter.replace(' ', '&nbsp;'))
            .map(letter => '<span class="letter">' + letter + '</span>')
            .join('');
    }

    public static addZeros(n, needLength) {
        needLength = needLength || 2;
        n = String(n);
        while (n.length < needLength) {
            n = '0' + n;
        }

        return n;
    }

    public static declOfNum(number, titles) {
        const cases = [2, 0, 1, 1, 1, 2];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }

    public static humanFileSize(bytes, si = true) {
        const thresh = si ? 1000 : 1024;
        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + ' ' + units[u];
    }
}
