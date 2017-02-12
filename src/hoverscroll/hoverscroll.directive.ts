import { Directive, ElementRef, HostListener, Input } from '@angular/core';


/**
 *  This directive creates an effect that vertically scrolls an element automatically when it is hovered upon when
 *  its contents have a greater height.
 *
 *  Currently it assumes the immediate child element is the contents of the scrollable element.
 *
 *  Support the following inputs:
 *      - scrollBuffer {number} Added scroll buffer on the top/bottom of the container.
 */
@Directive({
    selector: '[hoverScroll]'
})
export class HoverScrollDirective {
    
    private elem: any;
    @Input() scrollBuffer: number;
    
    constructor(el: ElementRef) {
        this.elem = el.nativeElement
    }

    /* -----------------------------
            Event Handlers
    ----------------------------- */

    @HostListener('pointermove', ['$event'])
    onPointerMove(pointer: PointerEvent) {

        if (!this.isScrollable()) {
            return;
        }

        // First -------------------------------------------------------------
        //  Determine the Y coordinate in relation to the top of the container vs the window
        let relativeY = pointer.pageY - this.elem.getBoundingClientRect().top;


        // Second ------------------------------------------------------------
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

        // Third -------------------------------------------------------------
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

