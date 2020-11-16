/**
 * --------------------------------------------------------------------------
 * ngx-hoverscroll
 * Licensed under MIT (https://github.com/arroyonetworks/ngx-hoverscroll/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { NgModule, ModuleWithProviders } from '@angular/core';
import { HoverScrollDirective } from './hoverscroll.directive';

@NgModule({
  declarations: [HoverScrollDirective],
  imports: [],
  exports: [HoverScrollDirective]
})
export class HoverScrollModule {
  public static forRoot(): ModuleWithProviders<HoverScrollModule> {
    return {ngModule: HoverScrollModule, providers: []};
  }
}
