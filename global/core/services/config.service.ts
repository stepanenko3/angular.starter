import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable()
export class ConfigService {

    constructor(private http: ApiService) {
    }

    public get osKey() {
        switch (navigator.platform) {
            case 'Android':
            case 'Linux armv7l':
            case 'Macintosh':
                return 'osx';
            case 'iPhone':
            case 'iPod':
            case 'iPad':
                return 'ios';
            case 'Linux':
                return 'linux';
            default:
                return 'windows';
        }
    }

    public get os() {
        return this._os[this.osKey];
    }
    private _config: Object = {};

    private _os = {
        windows: {
            icon: 'fa-windows',
            name: 'Windows',
        },
        'osx': {
            icon: 'fa-apple',
            name: 'Macintosh'
        },
        'linux': {
            icon: 'fa-linux',
            name: 'Linux'
        },
        'ios': {
            icon: 'fa-apple',
            name: 'iOS'
        },
        'android': {
            icon: 'fa-android',
            name: 'Android'
        }
    };

    load() {
        console.log(11);
        return this.http.get('app/config').pipe(take(1));
    }

    setConfig(config: Object) {
        this._config = config;
    }

    get(key: string, def: any = ''): any {
        return this.has(key) ? this._config[key] : def;
    }

    has(key: string) {
        return this._config && this._config[key];
    }

    get config() {
        return this._config;
    }
}
