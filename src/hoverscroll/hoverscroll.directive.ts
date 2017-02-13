import { Directive, ElementRef, HostListener, Input } from '@angular/core';


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

    private elem: any;
    private initY: number;
    private hasExceededStableBuffer: boolean;

    constructor(el: ElementRef) {
        this.elem = el.nativeElement;
        this.hasExceededStableBuffer = false;
    }

    /* -----------------------------
            Event Handlers
    ----------------------------- */

    @HostListener('pointerenter', ['$event'])
    onPointerEnter(pointer: PointerEvent) {
        this.hasExceededStableBuffer = false;
        this.initY = pointer.pageY;
    }

    @HostListener('pointerleave')
    onPointerLeave() {
        this.hasExceededStableBuffer = false;
    }

    @HostListener('pointermove', ['$event'])
    onPointerMove(pointer: PointerEvent) {

        if (!this.isScrollable()) {
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
        let relativeY = pointer.pageY - this.elem.getBoundingClientRect().top;


        // Third -------------------------------------------------------------
        //  Determine the Distance to Scroll the Content taking into account the Scroll Buffer Amount
        let distance = (relativeY - this.scrollBuffer) * this.getHiddenRatio();

        // If we are within the top buffer, move all the way up
        if (relativeY < this.scrollBuffer) {
            distance = 0;
        }

        // If we are within the bottom buffer, move all the way down
        if (relativeY > (this.elem.clientHeight - this.scrollBuffer)) {
            distance = (this.getChildHeight() - this.elem.clientHeight);
        }

        // Make sure we do not go past the end of the content, and if we are,
        // just set the distance to the bottom.
        if (distance > (this.getChildHeight() - this.elem.clientHeight)) {
            distance = (this.getChildHeight() - this.elem.clientHeight);
        }

        // Fourth ------------------------------------------------------------
        //  Update the Content Container Position
        this.moveChild(-distance)

    }

    /* -----------------------------
            Element Helpers
    ----------------------------- */

    private getChild(): any {
        return this.elem.firstElementChild
    }

    private getChildHeight(): number {
        return this.getChild().clientHeight;
    }

    /**
     * @returns {boolean} true if the content is scrollable, e.g. the inside content is larger than the outside
     * container, otherwise false.
     */
    private isScrollable(): boolean {
        return this.elem.clientHeight < this.getChildHeight();
    }

    /* -----------------------------
            Movement Helpers
    ----------------------------- */

    /**
     * @returns {number} The percentage of the content which is hidden and must be scrolled into view.
     */
    private getHiddenRatio(): number {
        // Make sure we subtract twice the scrollBuffer so that it is added to both the top and the bottom.
        return (this.getChildHeight() - this.elem.clientHeight) / (this.elem.clientHeight - (2 * this.scrollBuffer));
    }

    private moveChild(yPos: number) {
        let transform = "translateY(" + yPos + "px)";
        this.getChild().style.transform = transform;
        this.getChild().style["-webkit-transform"] = transform;
        this.getChild().style["-ms-transform"] = transform;
    }

}

