import {
    Component, Input, HostListener, EventEmitter, Output, ElementRef, Renderer2, OnDestroy,
    TemplateRef, forwardRef, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnChanges
} from '@angular/core';
import { Subscription, BehaviorSubject, Observable, Subject } from 'rxjs';
import { FilterPipe } from 'ngx-filter-pipe';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ViewRef_ } from '@angular/core/src/view';
import { switchMap } from 'rxjs/operators';


@Component({
    moduleId: module.id,
    selector: 'app-search-input',
    templateUrl: 'search-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchInputComponent),
            multi: true
        }
    ]
})
export class SearchInputComponent<T> implements OnDestroy, ControlValueAccessor, OnInit, OnChanges {

    @Input()
    public get placeholder(): string {
        return this._placeholder;
    }

    @HostBinding('style.opacity')
    get opacity() {
        return this.disabled ? 0.25 : 1;
    }

    constructor(
        private _element: ElementRef,
        renderer: Renderer2,
        private filter: FilterPipe,
        private cd: ChangeDetectorRef,
    ) {
        this.selected = new EventEmitter<T>();

        this._documentClickListener = renderer.listen('document', 'click',
            (e: MouseEvent) => this.onDocumentClick(e));

        this.subs.push(
            this.httpCountSubject.subscribe((count: number) => {
                this.httpCount = count;

                if (count > 0 && !this._isSearching) {
                    this._isSearching = true;
                } else if (count === 0 && this._isSearching) {
                    this._isSearching = false;
                }
            })
        );
    }

    public get query(): string {
        return this._query;
    }

    public set query(query: string) {
        this.selectedResult = undefined;

        this.updateQueryDelayed(query, this.callback.bind(this));
    }

    public get results(): T[] {
        return this._results;
    }

    public get isSearching(): boolean {
        return this._isSearching;
    }

    public set placeholder(placeholder: string) {
        this._placeholder = placeholder;
    }

    @Input()
    public retainSelectedResult = true;

    @Input()
    private searchDelay: number;

    @Input()
    private items: T[] = [];

    @Input()
    public disabled = false;

    @Input()
    private itemsObservable: (string) => Observable<T[]>;

    @Input()
    public template: TemplateRef<T>;

    @Input()
    private allowEmptyQuery = false;

    @Input()
    private oneLoad = false;

    @Output()
    public selected: EventEmitter<T>;

    @Input() private initialValue: any;

    public dropdownState = false;
    public selectedResult: T = null;
    public open = false;

    private _query = '';
    private _placeholder = '';
    private _searchDelayTimeout: any;
    private _isSearching = false;

    private _results: T[] = [];
    private _documentClickListener: () => void;

    private subs: Subscription[] = [];
    private httpCount = 0;
    private httpCountSubject = new BehaviorSubject<number>(this.httpCount);
    private loads = 0;
    private openedClick = false;

    private querySubject: BehaviorSubject<string> = new BehaviorSubject<string>(this._query);

    private httpResult$;

    @Input()
    private returnModifier: Function = (value) => value;

    ngOnInit() {
        if (this.items.length > 0 && !this.itemsObservable) {
            this.updateResults(this.items);
            this.cd.detectChanges();
        }

        if (this.itemsObservable) {
            this.httpResult$ = this.querySubject.pipe(switchMap(query => {
                return this.itemsObservable(query);
            }));
        }

        if (this.itemsObservable && this.oneLoad) {
            this.updateQuery(this.query, this.callback.bind(this));
        }

        if (this.searchDelay === undefined || this.searchDelay === null) {
            this.searchDelay = this.itemsObservable && !this.oneLoad ? 500 : 0;
        }
    }

    ngOnChanges(changes: any) {
        if (changes.items && this._results !== changes.items.currentValue && !this.itemsObservable) {
            this.updateResults(changes.items.currentValue);
            this.cd.detectChanges();
        }
    }

    public ngOnDestroy(): void {
        this._documentClickListener();

        for (const sub in this.subs) {
            if (this.subs.hasOwnProperty(sub)) {
                this.subs[sub].unsubscribe();
            }
        }
    }

    @HostListener('focusin')
    private onFocusIn(): void {
        this.open = true;
        if ((this.allowEmptyQuery && this._results && this._results.length > 0) || (this.query && this.query.length > 0)) {
            this.dropdownState = true;
            this.cd.detectChanges();
        }
    }

    @HostListener('focusout', ['$event'])
    private onFocusOut(e): void {
        if (e.relatedTarget && !this._element.nativeElement.contains(e.relatedTarget)) {
            this.dropdownState = false;
            this.open = false;
            this.cd.detectChanges();
        }
    }

    private updateQueryDelayed(query: string, callback: (err?: Error) => void = () => { }): void {
        this._query = query;

        clearTimeout(this._searchDelayTimeout);
        this._searchDelayTimeout = setTimeout(
            () => {
                this.updateQuery(query, callback);
            },
            this.searchDelay
        );
    }

    private updateQuery(query: string, callback: (err?: Error) => void = () => { }): void {
        this._query = query;

        if (this._query === '' && !this.allowEmptyQuery) {
            return callback();
        }

        if (this.itemsObservable && ((this.oneLoad && this.loads <= 0) || !this.oneLoad)) {
            this.loads++;

            this.httpCountSubject.next(this.httpCount + 1);
            this.cd.detectChanges();

            const _query = this._query;
            this.itemsObservable(this._query).subscribe(
                results => {
                    this.updateResults(results, _query);
                    this.items = results;

                    this.httpCountSubject.next(this.httpCount - 1);
                    return callback();
                }, () => {
                    this.httpCountSubject.next(this.httpCount - 1);
                    return callback();
                });


            this.querySubject.next(_query);
        } else {
            this.updateResults(this.filter.transform(this.items, { name: this._query }));
            return callback();
        }
    }

    private updateResults(results: T[], query?: string): void {
        this._results = results;
    }

    private select(result: T): void {
        this.writeValue(result);
    }

    public onDocumentClick(e: MouseEvent): void {
        if (this.openedClick) {
            this.openedClick = false;
            return;
        }

        if (!this._element.nativeElement.contains(e.target)) {
            this.dropdownState = false;
            this.open = false;
            this.cd.detectChanges();
        }
    }

    public openSearch(): void {
        if (!this.disabled && !this.open) {
            this.openedClick = true;
            this.onTouched();
            this.open = true;
            this.cd.detectChanges();
        }
    }

    private reset(): void {
        this.selectedResult = null;
        this._results = [];
        this.httpCountSubject.next(0);
        this.updateQuery('');
        this.cd.detectChanges();
    }

    writeValue(value: any) {
        const res = this.returnModifier(value);

        this.selected.emit(res);

        if (this.retainSelectedResult) {

            if (!this.selectedResult && this.initialValue) {
                this.selectedResult = this.initialValue;
            } else {
                this.selectedResult = value == null ? '' : value;
            }

            this.onChange(res);
        }

        this.dropdownState = false;
        this.open = false;
        this.updateQuery('', this.callback.bind(this));
    }

    setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
        this.cd.detectChanges();
    }

    onChange = (value: any) => { };
    onTouched = () => { };

    registerOnChange(callback: (change: any) => void): void {
        this.onChange = callback;
    }

    registerOnTouched(callback: () => void): void {
        this.onTouched = callback;
    }

    private callback() {
        this.dropdownState = this.open && ((this.allowEmptyQuery && this._results && this._results.length > 0) ||
            (this.query && this.query.length > 0));

        if (!(this.cd as ViewRef_).destroyed) { this.cd.detectChanges(); }
    }
}
