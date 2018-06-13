# ionic-swipeable-tabs
Simple and easy to use, make swipeable tabs inside any of your page.

To see this in action, [checkout the demo here](http://ejfrias.com/playground/ionic-swipeable-tabs/).

## Requirement
Ionic framework 3.x.x and above

### How to use
Make sure you have the latest version of ionic `npm install -g ionic`.

Start an Ionic app `ionic start ionic-swipeable-tabs blank`.

Create a placeholder component `ionic g component SwipeableTabs` and copy the `/src/components/swipeable-tabs/` folder from this repo to the app that you just created.

Make sure that the component is properly imported in `/src/components/components.module.ts`.

Import the component's module to `/src/app/page.module.ts`. Also, make sure that your app is configured to use the lazy loading feature!
```javascript
...
import { ComponentsModule } from '../components/components.module';

@NgModule({
	declarations: [...],
	imports: [
		...,
		IonicModule.forRoot(MyApp, {
			preloadModules: true //enable preloading of modules
		}),
		ComponentsModule,
	],
	exports: [...]
})
...
```
Finally, the component is now ready. Use the below template:
```html
<swipeable-tabs [tabs]="tabs">
	<ion-slides>
		<ion-slide *ngFor="let slide of slides">
			{{slide}}
		</ion-slide>
	</ion-slides>
</swipeable-tabs>
```
Then provide the data in your page `.ts` file like:
```javascript
...
export class HomePage {
	public tabs: Array<string>;
	public slides: any;

	constructor() {
		this.tabs = ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4'];
		this.slides = ['Slide 1 content', 'Slide 2 content', 'Slide 3 content', 'Slide 4 content'];
	}
}
...
```
That's it!

### Properties
Attr | Type | Default | Description
--- | --- | --- | ---
activeIndex | number | 0 | Index number of initial slide.
slidesFullHeight | boolean | true | Set to `false` to make the height of the slides the same as its content

### Compatibility
This component should work for all versions of Ionic framework from 3.x.x and above.

### Contribution
* Since this component was made to be as simple as possible, requesting and/or proposing a feature would not be entertained. However, submitting bugs/issues are always welcome.
* Got a **new feature**? Fork the repo, make your changes, and submit a pull request.

### Demo
[http://ejfrias.com/playground/ionic-swipeable-tabs/](http://ejfrias.com/playground/ionic-swipeable-tabs/)
