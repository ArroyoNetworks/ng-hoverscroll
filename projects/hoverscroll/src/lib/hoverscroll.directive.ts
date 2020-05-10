/**
 * --------------------------------------------------------------------------
 * ngx-hoverscroll
 * Licensed under MIT (https://github.com/arroyonetworks/ngx-hoverscroll/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { auditTime } from 'rxjs/operators';


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
 *      - scrollBuffer {number} Added scroll buffer on the top/bottom of the container. Default: 0px.
 *      - stableBuffer {number} Buffer on mouse entry that the cursor must traverse before scrolling. Default: 25px.
 */
@Directive({
  selector: '[hoverScroll]'
})
export class HoverScrollDirective implements OnInit, OnDestroy {

  @Input() scrollBuffer = 0;
  @Input() stableBuffer = 25;

  // The Directive's Element.
  private elem: any;

  // Initial Absolute Y-Coordinate on Enter.
  // This is used to determine if the mouse exceeds the stability buffers.
  private initY = 0;

  // The last known Y-Coordinate used on pointer move.
  private lastKnownY = 0;

  // Flag to Determine if Stabilizing Buffer has been Exceeded.
  private hasExceededStableBuffer = false;

  // Flag to Disable Pointer Event Handling until Pointer Re-enters.
  private disablePointerEvents = false;

  // Event Subscriptions
  private eventSubs: Map<string, Subscription>;

  constructor(el: ElementRef) {
    this.elem = el;
    this.eventSubs = new Map<string, Subscription>();
  }

  ngOnInit() {
    // Set up Event Handlers
    //  We do not use HostListeners for the Events we Want to Throttle
    this.setupWheelObservables();
    this.setupResizeObservables();
  }

  ngOnDestroy() {
    // Remove Event Handler Subscriptions
    this.eventSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  /**
   * Moves the child element to the top of the parent view.
   */
  public moveToTop() {
    this.moveChild(0);
  }

  /**
   * Moves the child element to the given absolute Y-coordinate.
   *
   * @param pointerY The Y-coordinate to move to.
   */
  public moveTo(pointerY) {
    const distance = this.calculateDistance(pointerY);
    this.moveChild(-distance);
  }

  /**
   * Moves the child element to the last known Y-coordinate.
   * This can be used to programmatically "re-center" the scroll.
   */
  public reset() {
    this.moveTo(this.lastKnownY);
  }

  /**
   * Determine if the child element can be scrolled.
   *
   * @returns true if the content is scrollable, e.g. the inside content is larger than the outside
   * container, otherwise false.
   */
  public isScrollable(): boolean {
    return this.getElemHeight() < this.getChildHeight();
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
    if (!this.isScrollable()) {
      this.moveToTop();
    }

    // Reset Initial Y Coordinate
    this.initY = 0;

    // Reset Flags
    this.hasExceededStableBuffer = false;
    this.disablePointerEvents = false;
  }

  @HostListener('pointermove', ['$event'])
  private onPointerMove(pointer: PointerEvent) {

    if (this.disablePointerEvents) {
      return;
    }

    if (!this.isScrollable()) {
      this.moveToTop();
      return;
    }

    //  Determine the Pointer has Exceeded the Stabilizing Threshold

    if (pointer.pageY > (this.initY + this.stableBuffer) || pointer.pageY < (this.initY - this.stableBuffer)) {
      this.hasExceededStableBuffer = true;
    }

    if (!this.hasExceededStableBuffer) {
      return;
    }

    this.moveTo(pointer.pageY);
    this.lastKnownY = pointer.pageY;
  }

  private calculateDistance(pointerY: number): number {
    const relativeY = pointerY - this.getElemTop();

    let distance = (relativeY - this.scrollBuffer) * this.getHiddenRatio();

    // If we are within the top buffer, move all the way up
    if (relativeY < this.scrollBuffer) {
      distance = 0;
    }

    // If we are within the bottom buffer, move all the way down
    if (relativeY > (this.getElemHeight() - this.scrollBuffer)) {
      distance = this.getHeightDifference();
    }

    return distance;
  }

  /* -----------------------------
      Scrolling Event Handlers
   ----------------------------- */

  private setupWheelObservables() {
    this.eventSubs['onWheel'] =  fromEvent<WheelEvent>(this.elem.nativeElement, 'wheel')
        .pipe(
          auditTime(10)
        )
        .subscribe((event) => {
          this.onWheelEvent(event);
        });
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
        console.warn('Unknown Wheel Delta Mode');
        return;
    }

    // Third -------------------------------------------------------------
    //  Update the Content Container Position
    const distance = this.getChildTop() - delta;
    this.moveChild(distance);
  }

  private setupResizeObservables() {
    this.eventSubs['onWindowResize'] = fromEvent<Event>(window, 'resize')
        .pipe(
          auditTime(500)
        )
        .subscribe(() => {
          if (!this.isScrollable()) {
            this.moveToTop();
          }
        });
  }

  /* -----------------------------
          Element Helpers
   ----------------------------- */

  private getElemHeight(): number {
    return this.elem.nativeElement.clientHeight;
  }

  private getElemTop(): number {
    return this.elem.nativeElement.getBoundingClientRect().top;
  }

  private getChild(): any {
    return this.elem.nativeElement.firstElementChild;
  }

  private getChildHeight(): number {
    return this.getChild().clientHeight;
  }

  private getChildTop(): number {
    return this.getChild().getBoundingClientRect().top;
  }

  private getHeightDifference(): number {
    return this.getChildHeight() - this.getElemHeight();
  }

  /* -----------------------------
          Movement Helpers
   ----------------------------- */

  /**
   * @returns The percentage of the content which is hidden and must be scrolled into view.
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
    if (yPos > 0) {
      yPos = 0;
    }

    const transform = 'translateY(' + yPos + 'px)';
    this.getChild().style.transform = transform;
    this.getChild().style['-webkit-transform'] = transform;
    this.getChild().style['-ms-transform'] = transform;
  }

}
