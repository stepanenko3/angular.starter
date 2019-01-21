import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { Menu } from '@core/models';
import { take } from 'rxjs/operators';
import { ApiService } from '@core/services';

@Injectable()
export class MenuService {

    private _menus: Menu[] = [];
    private subject: Subject<Menu[]>;

    constructor(private http: ApiService) {
        this.subject = new BehaviorSubject<Menu[]>(this._menus);
    }

    get(id: number) {
        return this.menus.find(menu => menu.id === id);
    }

    getByArea(area: string) {
        return this.menus.find(menu => menu.area === area);
    }

    get menus() {
        return this._menus;
    }

    get menus$(): Observable<Menu[]> {
        return this.subject.asObservable();
    }

    public setMenus(menus: Menu[]) {
        this._menus = menus;
        this.subject.next(menus);
    }

    load() {
        return this.http.get('app/menus').pipe(take(1));
    }
}
