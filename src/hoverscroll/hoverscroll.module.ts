import { NgModule, ModuleWithProviders } from '@angular/core';
import { HoverScrollDirective } from './hoverscroll.directive'

@NgModule({
    declarations: [HoverScrollDirective],
    exports: [HoverScrollDirective],
})
export class HoverScrollModule {
    public static forRoot(): ModuleWithProviders {
        return {ngModule: HoverScrollModule, providers: []};
    }
}