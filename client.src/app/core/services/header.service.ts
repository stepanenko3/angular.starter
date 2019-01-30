import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class HeaderService {

    private _responsive;
    private _project;
    private _front = false;

    private subjectResponsive = new BehaviorSubject<string>(this._responsive);
    private subjectProject = new BehaviorSubject<any>(this._project);
    private subjectFront = new BehaviorSubject<boolean>(this._front);

    constructor() { }

    set responsive(bool: string) {
        this._responsive = bool;
        this.subjectResponsive.next(this._responsive);
    }

    get responsive(): string {
        return this._responsive;
    }

    get responsive$(): Observable<string> {
        return this.subjectResponsive.asObservable();
    }


    set project(bool: any) {
        this._project = bool;
        this.subjectProject.next(this._project);
    }

    get project(): any {
        return this._project;
    }

    get project$(): Observable<any> {
        return this.subjectProject.asObservable();
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
