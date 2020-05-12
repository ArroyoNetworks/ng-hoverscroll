<div align="center">
    <h1>ngx-hoverscroll</h1>
    <p>Angular Directive for Scrolling on Hover</p>
    <img src="https://raw.githubusercontent.com/arroyonetworks/ngx-hoverscroll/f3698d0ac7d01bddb67dc67a1dfed6ab28b92b69/docs/hoverscroll.gif">
</div>

## Dependencies

Angular Support

| Version           | Angular Version   |
|:-----------------:|:-----------------:|
| 2.0.0             | 6-7               |
| **2.0.2**         | 6-9               |


No external dependencies other than Angular are required!

## Installation

Install `@arroyo/ngx-hoverscroll` from `npm`:
```bash
> npm install @arroyo/ngx-hoverscroll
```


## Setup

Follow the instructions below for adding `ngx-hoverscroll` to your Angular application:

1. Add the Imports to your Module. For example, `app.module.ts`:
    ```typescript
    import { HoverScrollModule } from '@arroyo/ngx-hoverscroll';
    ...
    
    @NgModule({
      ...
      imports: [HoverScrollModule.forRoot(), ... ],
      ... 
    })
    ```
    
2. Add the `hoverScroll` Directive to Your Template:
    ```angular2html
    <div class="site-sidebar">
      <div class="site-sidebar-body" hoverScroll>
        <ul class="site-menu" data-plugin="menu">
           ...
        </ul>
       </div>
    </div>
    ```

At this time, only vertical scrolling is supported.

### Demo App

A demo application is included. It is built with `angular-cli`. To run the demo install `angular-cli` and run:
```bash
> ng serve demo
```

The demo application is found in the `demo/` directory inside projects.


### Advanced Usage

The `hoverScroll` directive selects the immediate child as the "scrolled" content.
The inner container should overflow the outer container in order to provide scrolling content.

One way to accomplish this is to set the outer container to be a max-height of the window and the inner
container to contain it's natural height.

See the demo app for a working example.


#### Options

The directive takes the following inputs:

| Input Name                | Type      | Default   | Description   |
|:--------------------------|:---------:|:---------:|:--------------|
| scrollBuffer              | number    | `0`       | Added buffer in pixels (vertically) on the top/bottom of the container in which scrolling will not occur.
| stableBuffer              | number    | `25`      | Tolerance in pixels (vertically) that the cursor must traverse before scrolling.
| wheelMultiplier           | number    | `2`       | Multiplier of delta change when scrolling with the mouse wheel.

The directive also exposes the following public methods:

| Method                    | Description   |
|:--------------------------|:--------------|
| moveToTop                 | Moves the scrollable content to the top of the parent view.
| moveToBottom              | Moves the scrollable content to the bottom of the parent view.
| moveToLast                | Moves the scrollable content to the last known Y-coordinate of the mouse.
| moveTo(Y-coordinate)      | Moves the scrollable content to the given absolute Y-coordinate.
| reset                     | Ensures that the scrollable content is not out-of-bounds of the parent.
| isScrollable              | Returns true if the content is scrollable (e.g. the inside content is larger than the outside content).


## License

MIT License

Copyright (c) 2017 Arroyo Networks, LLC <br>
Copyright (c) 2020 Arroyo Networks, Inc.
