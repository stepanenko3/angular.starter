import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';

@Injectable()
export class MetaService {
    private titleSubject: Subject<string>;
    private descSubject: Subject<string>;
    private keysSubject: Subject<string>;

    constructor(
        private titleService: Title,
        private metaService: Meta,
    ) {
        this.titleSubject = new BehaviorSubject<string>(this.title);
        this.descSubject = new BehaviorSubject<string>(this.desc);
        this.keysSubject = new BehaviorSubject<string>(this.keys);
    }

    /*
    * Title
    */
    set title(str: string) {
        this.titleService.setTitle(str);
        this.titleSubject.next(str);
    }

    get title() {
        return this.titleService.getTitle();
    }

    get title$(): Observable<string> {
        return this.titleSubject.asObservable();
    }

    /*
    * Description
    */
    set desc(str) {
        this.metaService.addTag({ name: 'description', content: str });
        this.descSubject.next(str);
    }

    get desc() {
        const tmp = this.metaService.getTag('description');
        return tmp ? tmp.content : '';
    }

    get desc$(): Observable<string> {
        return this.descSubject.asObservable();
    }

    /*
    * Keywords
    */
    set keys(str) {
        this.metaService.addTag({ name: 'keywords', content: str });
        this.keysSubject.next(str);
    }

    get keys() {
        const tmp = this.metaService.getTag('keywords');
        return tmp ? tmp.content : '';
    }

    get keys$(): Observable<string> {
        return this.keysSubject.asObservable();
    }
}
