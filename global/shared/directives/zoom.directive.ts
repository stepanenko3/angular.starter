import { Directive, ElementRef, HostListener, Inject, Input, Optional, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: 'img[zoom]'
})
export class ZoomDirective {

    private _offset = 80;

    private _fullHeight;
    private _fullWidth;

    private _overlay;
    private _targetImageWrap;

    private _imgScaleFactor;
    private _translateY;
    private _translateX;

    private _initialScrollPosition;
    private _initialTouchPosition;

    private readonly _body;

    private scrollListener: Function;
    private keyUpListener: Function;
    private touchStartListener: Function;
    private touchMoveListener: Function;
    private clickListener: Function;


    @HostListener('click', ['$event'])
    zoom(e) {
        if (this._body.classList.contains('zoom-overlay-open') || this._body.classList.contains('zoom-overlay-transitioning')) { return; }

        if (e.metaKey || e.ctrlKey) {
            return window.open((e.target.getAttribute('data-original') || e.target.src), '_blank');
        }

        this._activeZoomClose(true);

        this.zoomImage();

        this.scrollListener =
            this.renderer.listen('window', 'scroll', (ev) => this._scrollHandler(ev));
        this.keyUpListener =
            this.renderer.listen('document', 'keyup', (ev) => this._keyHandler(ev));
        this.touchStartListener =
            this.renderer.listen('document', 'touchstart', (ev) => this._touchStart(ev));
        this.clickListener =
            this.renderer.listen('document', 'click', (ev) => this._clickHandler(ev));

        if ('bubbles' in e) {
            if (e.bubbles) { e.stopPropagation(); }
        } else {
            e.cancelBubble = true;
        }
    }

    constructor(
        private el: ElementRef,
        @Optional() @Inject(DOCUMENT) private document: any,
        private renderer: Renderer2,
    ) {
        this._body = this.document.body || this.document.documentElement;
    }


    private _activeZoomClose(forceDispose: boolean = false) {
        if (forceDispose) {
            this.dispose();
        } else {
            this.close();
        }

        if (this.scrollListener) {
            this.scrollListener();
            this.scrollListener = null;
        }
        if (this.keyUpListener) {
            this.keyUpListener();
            this.keyUpListener = null;
        }
        if (this.touchStartListener) {
            this.touchStartListener();
            this.touchStartListener = null;
        }
        if (this.touchMoveListener) {
            this.touchMoveListener();
            this.touchMoveListener = null;
        }
        if (this.clickListener) {
            this.clickListener();
            this.clickListener = null;
        }
    }

    private _scrollHandler(e) {
        if (!this._initialScrollPosition && this._initialScrollPosition !== 0) { this._initialScrollPosition = pageYOffset; }
        if (Math.abs(this._initialScrollPosition - pageYOffset) >= 40) { this._activeZoomClose(); }
    }

    private _keyHandler(e) {
        if (e.keyCode === 27) { this._activeZoomClose(); }
    }

    private _clickHandler(e) {
        if (e.preventDefault) { e.preventDefault(); } else { event.returnValue = false; }

        if ('bubbles' in e) {
            if (e.bubbles) { e.stopPropagation(); }
        } else {
            e.cancelBubble = true;
        }

        this._activeZoomClose();
    }

    private _touchStart(e) {
        this._initialTouchPosition = e.touches[0].pageY;

        this.touchMoveListener = this.renderer.listen(e.target, 'touchmove.zoom', this._touchMove);
    }

    private _touchMove(e) {
        if (Math.abs(e.touches[0].pageY - this._initialTouchPosition) > 10) {
            this._activeZoomClose();
            this.touchMoveListener();
        }
    }


    zoomImage() {
        const img = this.document.createElement('img');
        img.onload = () => {
            this._fullHeight = Number(img.height);
            this._fullWidth = Number(img.width);

            this._zoomOriginal();
        };

        img.src = this.el.nativeElement.src;
    }

    _zoomOriginal() {
        this._targetImageWrap = this.document.createElement('div');
        this._targetImageWrap.className = 'zoom-img-wrap';

        this.el.nativeElement.parentNode.insertBefore(this._targetImageWrap, this.el.nativeElement);
        this._targetImageWrap.appendChild(this.el.nativeElement);

        this.renderer.addClass(this.el.nativeElement, 'zoom-img');

        this._overlay = this.document.createElement('div');
        this._overlay.className = 'zoom-overlay';

        this.document.body.appendChild(this._overlay);

        this._calculateZoom();
        this._triggerAnimation();
    }

    _calculateZoom() {
        const originalFullImageWidth = this._fullWidth;
        const originalFullImageHeight = this._fullHeight;

        const maxScaleFactor = originalFullImageWidth / this.el.nativeElement.width;

        const viewportHeight = (window.innerHeight - this._offset);
        const viewportWidth = (window.innerWidth - this._offset);

        const imageAspectRatio = originalFullImageWidth / originalFullImageHeight;
        const viewportAspectRatio = viewportWidth / viewportHeight;

        if (originalFullImageWidth < viewportWidth && originalFullImageHeight < viewportHeight) {
            this._imgScaleFactor = maxScaleFactor;

        } else if (imageAspectRatio < viewportAspectRatio) {
            this._imgScaleFactor = (viewportHeight / originalFullImageHeight) * maxScaleFactor;

        } else {
            this._imgScaleFactor = (viewportWidth / originalFullImageWidth) * maxScaleFactor;
        }
    }

    _triggerAnimation() {
        const viewportY = pageYOffset + (window.innerHeight / 2);
        const viewportX = (window.innerWidth / 2);

        const offset = this.el.nativeElement.getBoundingClientRect();

        const imageCenterY = pageYOffset + offset.top + (this.el.nativeElement.height / 2);
        const imageCenterX = pageXOffset + offset.left + (this.el.nativeElement.width / 2);

        this._translateY = viewportY - imageCenterY;
        this._translateX = viewportX - imageCenterX;

        const targetTransform = 'scale(' + this._imgScaleFactor + ')';
        let imageWrapTransform = 'translate(' + this._translateX + 'px, ' + this._translateY + 'px)';

        imageWrapTransform += ' translateZ(0)';

        this.renderer.setStyle(this.el.nativeElement, 'transform', targetTransform);
        this.renderer.setStyle(this._targetImageWrap, 'transform', imageWrapTransform);

        this.renderer.addClass(this.document.body || this.document.documentElement, 'zoom-overlay-open');
    }

    close() {
        this.renderer.removeClass(this._body, 'zoom-overlay-open');
        this.renderer.addClass(this._body, 'zoom-overlay-transitioning');

        this.renderer.removeStyle(this.el.nativeElement, 'transform');
        if (this._targetImageWrap) { this.renderer.removeStyle(this._targetImageWrap, 'transform'); }

        setTimeout(() => {
            this.dispose();
        }, 300);
    }

    dispose() {
        if (this._targetImageWrap && this._targetImageWrap.parentNode) {

            this.renderer.removeClass(this.el.nativeElement, 'zoom-img');

            this._targetImageWrap.parentNode.replaceChild(this.el.nativeElement, this._targetImageWrap);
            this._overlay.parentNode.removeChild(this._overlay);

            this.renderer.removeClass(this._body, 'zoom-overlay-transitioning');
        }
    }
}
