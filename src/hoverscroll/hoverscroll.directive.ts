import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Observable } from "rxjs";


enum ScrollDeltaMode {
    DOM_DELTA_PIXEL = 0x00,
    DOM_DELTA_LINE = 0x01,
    DOM_DELTA_PAGE = 0x02,
}

/**
 *  This directive creates an effect that vertically scrolls an element automatically when it is hovered upon when
 *  its contents have a greater height.
 *
 *  Currently it assumes the immediate child element is the contents of the scrollable element.
 *
 *  Support the following inputs:
 *      - scrollBuffer {number} Added scroll buffer on the top/bottom of the container.
 *      - stableBuffer {number} Buffer on mouse entry that the cursor must traverse before scrolling. Default: 25px.
 */
@Directive({
    selector: '[hoverScroll]'
})
export class HoverScrollDirective {

    @Input() scrollBuffer: number;
    @Input() stableBuffer: number = 25;

    // The Directive's Element.
    private elem: any;

    // Initial Absolute Y-Coordinate on Enter.
    private initY: number = 0;

    // Flag to Determine if Stabilizing Buffer has been Exceeded.
    private hasExceededStableBuffer: boolean = false;

    // Flag to Disable Pointer Event Handling until Pointer Re-enters.
    private disablePointerEvents: boolean = false;

    constructor(el: ElementRef) {
        this.elem = el;

        // Set up Event Handlers
        //  We do not use HostListeners for the Events we Want to Throttle
        this.setupWheelObservables();
    }

    /* -----------------------------
         Pointer Event Handlers
    ----------------------------- */

    @HostListener('pointerenter', ['$event'])
    private onPointerEnter(pointer: PointerEvent) {
        this.initY = pointer.pageY;
    }

    @HostListener('pointerleave')
    private onPointerLeave() {

        // Reset Flags
        this.hasExceededStableBuffer = false;
        this.disablePointerEvents = false;
    }

    @HostListener('pointermove', ['$event'])
    private onPointerMove(pointer: PointerEvent) {

        if (!this.isScrollable() || this.disablePointerEvents) {
            return;
        }

        // First -------------------------------------------------------------
        //  Determine the Pointer has Exceeded the Stabilizing Threshold
        if (pointer.pageY > (this.initY + this.stableBuffer) || pointer.pageY < (this.initY - this.stableBuffer)) {
            this.hasExceededStableBuffer = true;
        }

        if (!this.hasExceededStableBuffer) {
            return;
        }

        // Second ------------------------------------------------------------
        //  Determine the Y coordinate in relation to the top of the container vs the window
        let relativeY = pointer.pageY - this.getElemTop();


        // Third -------------------------------------------------------------
        //  Determine the Distance to Scroll the Content taking into account the Scroll Buffer Amount
        let distance = (relativeY - this.scrollBuffer) * this.getHiddenRatio();

        // If we are within the top buffer, move all the way up
        if (relativeY < this.scrollBuffer) {
            distance = 0;
        }

        // If we are within the bottom buffer, move all the way down
        if (relativeY > (this.getElemHeight() - this.scrollBuffer)) {
            distance = this.getHeightDifference();
        }

        // Fourth ------------------------------------------------------------
        //  Update the Content Container Position
        this.moveChild(-distance)
    }

    /* -----------------------------
        Scrolling Event Handlers
    ----------------------------- */

    private setupWheelObservables() {
        Observable.fromEvent<WheelEvent>(this.elem.nativeElement, 'wheel')
             .auditTime(10)
            .subscribe((event) => {this.onWheelEvent(event)});
    }

    private onWheelEvent(wheel: WheelEvent) {

        // First -------------------------------------------------------------
        //  Disable Pointer Events
        this.disablePointerEvents = true;

        // Second ------------------------------------------------------------
        //  Determine how many pixels to scroll
        let delta = 0;
        switch (wheel.deltaMode) {
            case ScrollDeltaMode.DOM_DELTA_PIXEL:
                delta = wheel.deltaY;
                break;
            case ScrollDeltaMode.DOM_DELTA_LINE:
                delta = this.getChild().style.lineHeight * wheel.deltaY;
                break;
            case ScrollDeltaMode.DOM_DELTA_PAGE:
                delta = this.getElemHeight() * wheel.deltaY;
                break;
            default:
                console.warn("Unknown Wheel Delta Mode");
                return
        }

        // Third -------------------------------------------------------------
        //  Update the Content Container Position
        let distance = this.getChildTop() - delta;
        this.moveChild(distance);
    }

    /* -----------------------------
            Element Helpers
    ----------------------------- */

    private getElemHeight(): number {
        return this.elem.nativeElement.clientHeight;
    }

    private getElemTop(): number {
        return this.elem.nativeElement.getBoundingClientRect().top
    }

    private getChild(): any {
        return this.elem.nativeElement.firstElementChild
    }

    private getChildHeight(): number {
        return this.getChild().clientHeight;
    }

    private getChildTop(): number {
        return this.getChild().getBoundingClientRect().top
    }

    private getHeightDifference(): number {
        return this.getChildHeight() - this.getElemHeight();
    }

    /* -----------------------------
            Movement Helpers
    ----------------------------- */

    /**
     * @returns {boolean} true if the content is scrollable, e.g. the inside content is larger than the outside
     * container, otherwise false.
     */
    private isScrollable(): boolean {
        return this.getElemHeight() < this.getChildHeight();
    }

    /**
     * @returns {number} The percentage of the content which is hidden and must be scrolled into view.
     */
    private getHiddenRatio(): number {
        // Make sure we subtract twice the scrollBuffer so that it is added to both the top and the bottom.
        return this.getHeightDifference() / (this.getElemHeight() - (2 * this.scrollBuffer));
    }

    private moveChild(yPos: number) {

        // Make sure we do not go past the end of the content, and if we are,
        // just set the distance to the bottom.
        if (yPos < -this.getHeightDifference()) {
            yPos = -this.getHeightDifference();
        }

        // Make sure we do not go past the top of the content, and if we are,
        // just set the distance to the top.
        if (yPos > this.getElemTop()) {
            yPos = 0;
        }

        let transform = "translateY(" + yPos + "px)";
        this.getChild().style.transform = transform;
        this.getChild().style["-webkit-transform"] = transform;
        this.getChild().style["-ms-transform"] = transform;
    }

}

