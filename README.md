# ngx-hoverscroll

Angular Directive for Hover Scrolling: Scroll Content by Hovering Over It

![ngx-hoverscroll in action](https://github.com/ArroyoNetworks/ngx-hoverscroll/raw/master/docs/hoverscroll.gif)

## Supported Angular Versions

**2.0.0**
- Angular 6
- Angular 7 

### Table of Contents

1. [Installation](#installation)
2. [Getting Started](#getting-started)
    1. [Demo App](#demo-app)
    2. [Advanced Usage](#advanced-usage)
3. [Contributing](#contributing)


## Installation

Install `@arroyo/ngx-hoverscroll` from `npm`:
```bash
> npm install @arroyo/ngx-hoverscroll
```

It's that simple.


## Getting Started

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

Currently only vertical scrolling is supported.

### Demo App

A demo application is included. It is built with `angular-cli`. To run the demo install `angular-cli` and run:
```bash
> ng serve demo
```

The demo application is found in the `demo/` directory.


### Advanced Usage

The `hoverScroll` directive selects the immediate child as the "scrolled" content.
The inner container should overflow the outer container in order to provide scrolling content.

One way to accomplish this is to set the outer container to be a max-height of the window and the inner
container to contain it's natural height.

See the demo app for a working example.


#### Options

The directive takes the following inputs:

- ``scrollBuffer (number)`` Added scroll buffer on the top/bottom of the container. Default: 0px.
- ``stableBuffer (number)`` Buffer on mouse entry that the cursor must traverse before scrolling. Default: 25px.


## Contributing

By submitting a pull request or changes for this project, you agree to license your contribution
under the MIT license to this project.

To ensure that you have the ability to publish your changes under our licensing requirements, we require
that you, as the patch provider, provide a Sign-off, which provided, means that you have the necessary permissions or have been
granted the permissions to provide the offered code or patches. 

As an author, please sign your commits as often as possible using your published GPG key.

