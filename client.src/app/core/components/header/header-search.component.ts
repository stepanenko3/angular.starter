import {
    Component,
    Input,
    HostListener,
    EventEmitter,
    Output,
    ElementRef,
    Renderer2,
    OnDestroy, ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';

import { SearchService } from '../../services';

interface ICachedArray<T> {
    [query: string]: SearchResults;
}

interface IRecursiveObject {
    [name: string]: IRecursiveObject;
}

interface SearchResults {
    any: any;
    // products: any;
}

@Component({
    moduleId: module.id,
    selector: 'app-header-search',
    templateUrl: 'header-search.component.html',
})
export class HeaderSearchComponent<T> implements OnDestroy {
    public dropdownState = false;
    public selectedResult?: T;

    @Input()
    public get placeholder(): string {
        return this._placeholder;
    }

    @Input()
    public retainSelectedResult: boolean;

    @Input()
    private searchDelay = 500;

    @Output()
    public resultSelected: EventEmitter<T>;

    private _query: string;
    private _searchDelayTimeout: number;
    private allowEmptyQuery = false;
    private _isSearching: boolean;
    private _placeholder: string;

    private _results: SearchResults;
    private _resultsCache: ICachedArray<T>;
    private _documentClickListener: () => void;

    private sub: Subscription = new Subscription();
    private httpCount = 0;
    private httpCountSubject = new BehaviorSubject<number>(this.httpCount);

    constructor(
        private _element: ElementRef,
        renderer: Renderer2,
        private searchService: SearchService,
        private router: Router,
        private cd: ChangeDetectorRef,
    ) {
        this.retainSelectedResult = true;
        this.resultSelected = new EventEmitter<T>();

        this._documentClickListener =
            renderer.listen('document', 'click', (e: MouseEvent) => {
                return this.onDocumentClick(e);
            });

        this.sub.add(this.httpCountSubject.subscribe((count: number) => {
            this.httpCount = count;

            this._isSearching = count > 0;
        }));

        this.reset();
    }

    public ngOnDestroy(): void {
        this._documentClickListener();
        this.sub.unsubscribe();
    }

    @HostListener('focusin')
    private onFocusIn(): void {
        if (this.query && this.query.length > 0) {
            this.dropdownState = true;
            this.cd.detectChanges();
        }
    }

    @HostListener('focusout', ['$event'])
    private onFocusOut(e): void {
        if (!this._element.nativeElement.contains(e.relatedTarget)) {
            this.dropdownState = false;
            this.cd.detectChanges();
        }
    }


    public get query(): string {
        return this._query;
    }

    public set query(query: string) {
        this.selectedResult = undefined;

        this.updateQueryDelayed(query, () => {
            this.dropdownState = this.query.length > 0;
            this.cd.detectChanges();
        });
    }

    public get results(): SearchResults {
        return this._results;
        // if() {
        //     if(this._results['products'] && this._results['products'].legth > 0) {
        //
        //     }
        // }
        // return undefined;
    }

    public get isSearching(): boolean {
        return this._isSearching;
    }

    public set placeholder(placeholder: string) {
        this._placeholder = placeholder;
    }

    private updateQueryDelayed(query: string, callback: (err?: Error) => void = () => { }): void {
        this._query = query;

        clearTimeout(this._searchDelayTimeout);
        this._searchDelayTimeout = window.setTimeout(
            () => {
                this.updateQuery(query, callback);
            },
            this.searchDelay
        );
    }

    private updateQuery(query: string, callback: (err?: Error) => void = () => { }): void {
        this._query = query;

        if (this._query === '' && !this.allowEmptyQuery) {
            // Don't update if the new query is empty (and we don't allow empty queries).
            // Don't reset so that when animating closed we don't get a judder.
            return callback();
        }

        if (this._resultsCache && this._resultsCache.hasOwnProperty(this._query)) {
            // If the query is already cached, make use of it.
            this._results = this._resultsCache[this._query];

            return callback();
        }

        this.httpCountSubject.next(this.httpCount + 1);
        this.cd.detectChanges();

        this.searchService.quickLinks(this.query).subscribe(
            results => {
                this.httpCountSubject.next(this.httpCount - 1);
                this.updateResults(results);

                return callback();
            },
            error => {
                this.httpCountSubject.next(this.httpCount - 1);
                return callback(error);
            });

        return callback();
    }

    private updateResults(results: SearchResults): void {
        this._resultsCache[this._query] = results;
        this._results = results;
    }

    public onDocumentClick(e: MouseEvent): void {
        if (!this._element.nativeElement.contains(e.target)) {
            this.dropdownState = false;
            this.cd.detectChanges();
        }
    }

    private reset(): void {
        this._results = {
            any: ''
            // products: [],
            // categories: [],
            // articles: []
        };
        this._resultsCache = {};
        this.httpCountSubject.next(0);
        this.updateQuery('');
    }

    navSearch() {
        this.dropdownState = false;
        this.router.navigate(['/search' + (this.query ? '/' + this.query : '')]);
    }
}
