import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class HeaderService {

    private _front = false;
    private _isBlack = true;
    private _pinned = false;
    private _catalogState = false;
    private _searchState = false;

    private subjectFront = new BehaviorSubject<boolean>(this._front);
    private subjectBlack = new BehaviorSubject<boolean>(this._isBlack);
    private subjectPinned = new BehaviorSubject<boolean>(this._pinned);
    private catalogSubject = new BehaviorSubject<boolean>(this._catalogState);
    private searchSubject = new BehaviorSubject<boolean>(this._searchState);

    constructor() { }

    set catalogState(state: boolean) {
        this._catalogState = state;
        this.catalogSubject.next(state);
    }

    get catalogState(): boolean {
        return this._catalogState;
    }

    get catalogState$(): Observable<boolean> {
        return this.catalogSubject.asObservable();
    }

    set searchState(state: boolean) {
        this._searchState = state;
        this.searchSubject.next(state);
    }

    get searchState(): boolean {
        return this._searchState;
    }

    get searchState$(): Observable<boolean> {
        return this.searchSubject.asObservable();
    }

    set pinned(bool: boolean) {
        this._pinned = bool;
        this.subjectPinned.next(this._pinned);
    }

    get pinned(): boolean {
        return this._pinned;
    }

    get pinned$(): Observable<boolean> {
        return this.subjectPinned.asObservable();
    }

    set black(bool: boolean) {
        this._isBlack = bool;
        this.subjectBlack.next(this._isBlack);
    }

    get black(): boolean {
        return this._isBlack;
    }

    get black$(): Observable<boolean> {
        return this.subjectBlack.asObservable();
    }

    set front(bool: boolean) {
        this._front = bool;
        this.subjectFront.next(this._front);
    }

    get front(): boolean {
        return this._front;
    }

    get front$(): Observable<boolean> {
        return this.subjectFront.asObservable();
    }
}
