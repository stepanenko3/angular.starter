import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { Breadcrumb } from '../models';

@Injectable()
export class BreadcrumbsService {

    private _data: Breadcrumb[] = [];
    private subject: Subject<Breadcrumb[]>;

    constructor() {
        this._data = [];
        this.subject = new BehaviorSubject<Breadcrumb[]>(this._data);
    }

    set data(breadcrumbs: Breadcrumb[]) {
        this._data = breadcrumbs;
        this.subject.next(this._data);
    }

    get data() {
        return this._data;
    }

    get data$(): Observable<Breadcrumb[]> {
        return this.subject.asObservable();
    }

    add(breadcrumb: Breadcrumb): void {
        this._data.push(breadcrumb);
        this.subject.next(this._data);
    }

    remove(breadcrumb: Breadcrumb): void {
        this._data.splice(this._data.indexOf(breadcrumb), 1);
        this.subject.next(this._data);
    }

    clean(): void {
        this._data = [];
        this.subject.next(this._data);
    }
}
