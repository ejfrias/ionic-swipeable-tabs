import { NgModule } from '@angular/core';
import { IonicModule } from "ionic-angular";
import { SwipeableTabsComponent } from './swipeable-tabs/swipeable-tabs';

@NgModule({
	declarations: [SwipeableTabsComponent],
	imports: [IonicModule],
	exports: [SwipeableTabsComponent]
})
export class ComponentsModule {}
