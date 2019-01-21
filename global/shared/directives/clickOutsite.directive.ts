import {
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    Injectable,
    Inject,
    PLATFORM_ID, Optional
} from '@angular/core';

import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable()
@Directive({ selector: '[appClickOutside]' })
export class ClickOutsideDirective implements OnInit, OnChanges, OnDestroy {


    @Input() attachOutsideOnClick = false;
    @Input() delayClickOutsideInit = false;
    @Input() exclude = '';
    @Input() excludeBeforeClick = false;
    @Input() clickOutsideEvents = '';

    @Output() clickOutside: EventEmitter<Event> = new EventEmitter<Event>();

    private _nodesExcluded: Array<HTMLElement> = [];
    private _events: Array<string> = ['click'];

    constructor(
        private _el: ElementRef,
        @Inject(PLATFORM_ID) protected platformId: Object,
        @Optional() @Inject(DOCUMENT) private document: any,
    ) {
        this._initOnClickBody = this._initOnClickBody.bind(this);
        this._onClickBody = this._onClickBody.bind(this);
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this._init();
        }
    }

    ngOnDestroy() {
        if (isPlatformBrowser(this.platformId)) {

            if (this.attachOutsideOnClick) {
                this._events.forEach(e => this._el.nativeElement.removeEventListener(e, this._initOnClickBody));
            }

            if (this.document) {
                this._events.forEach(e => this.document.body.removeEventListener(e, this._onClickBody));
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (isPlatformBrowser(this.platformId)) {

            if (changes['attachOutsideOnClick'] || changes['exclude']) {
                this._init();
            }
        }
    }

    private _init() {
        if (this.clickOutsideEvents !== '') {
            this._events = this.clickOutsideEvents.split(' ');
        }

        this._excludeCheck();

        if (this.attachOutsideOnClick) {
            this._events.forEach(e => this._el.nativeElement.addEventListener(e, this._initOnClickBody));
        } else {
            this._initOnClickBody();
        }
    }

    private _initOnClickBody() {
        if (this.delayClickOutsideInit) {
            setTimeout(this._initClickListeners.bind(this));
        } else {
            this._initClickListeners();
        }
    }

    private _initClickListeners() {
        if (this.document) {
            this._events.forEach(e => this.document.body.addEventListener(e, this._onClickBody));
        }
    }

    private _excludeCheck() {
        if (this.exclude && this.document) {
            try {
                const nodes = Array.from(this.document.querySelectorAll(this.exclude)) as Array<HTMLElement>;
                if (nodes) {
                    this._nodesExcluded = nodes;
                }
            } catch (err) {
                console.error('[ng-click-outside] Check your exclude selector syntax.', err);
            }
        }
    }

    private _onClickBody(ev: Event) {
        if (this.excludeBeforeClick) {
            this._excludeCheck();
        }

        if (!this._el.nativeElement.contains(ev.target) && !this._shouldExclude(ev.target)) {
            this.clickOutside.emit(ev);

            if (this.attachOutsideOnClick && this.document) {
                this._events.forEach(e => this.document.body.removeEventListener(e, this._onClickBody));
            }
        }
    }

    private _shouldExclude(target): boolean {
        for (const excludedNode of this._nodesExcluded) {
            if (excludedNode.contains(target)) {
                return true;
            }
        }

        return false;
    }
}
