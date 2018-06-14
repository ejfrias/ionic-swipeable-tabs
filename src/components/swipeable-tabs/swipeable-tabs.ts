import { Component, Input, OnInit, OnDestroy, ElementRef, Renderer2, ContentChild, HostListener } from '@angular/core';
import { Slides } from 'ionic-angular';

@Component({
	selector: 'swipeable-tabs',
	templateUrl: 'swipeable-tabs.html'
})
export class SwipeableTabsComponent implements OnInit, OnDestroy {
	@Input('tabs') tabs: Array<string>;
	@Input('activeIndex') activeIndex: number = 0;
	@Input('slidesFullHeight') slidesFullHeight: any = true;
	@ContentChild(Slides) slides: Slides;
	@HostListener('window:resize') onWindowResize() {
		//update the active tab indicator when the window has been resized
		this.updateTabWidth();
	}

	public activeTabIndicator: HTMLElement;
	public tabsEl: Array<HTMLElement>;
	public tabsHeader: HTMLElement;
	public tabWidth: number;
	public slideWidth: number;
	public slideContainer: HTMLElement;
	public slideChanged$;

	constructor(
		public el: ElementRef,
		public renderer: Renderer2
	) {}

	ngOnInit() {}

	/**
	 * All input will be initilized after this function so
	 * we start setting up everything here
	 */
	ngAfterViewInit() {
		//set the height of the slides
		if (String(this.slidesFullHeight).toLowerCase() == 'false') {
			this.renderer.addClass(this.el.nativeElement, 'slides-height-auto');
		}
	
		//get the needed elements
		this.tabsHeader = this.el.nativeElement.querySelector('.swipeable-tabs-header');
		this.activeTabIndicator = this.el.nativeElement.querySelector('.active-tab-indicator');
		this.slideContainer = this.el.nativeElement.querySelector('.swiper-container');

		//get each tab element
		this.getTabs();

		//set the active tab indicator width
		this.updateTabWidth();

		//set active tab
		if (this.activeIndex != 0) {
			//make sure we run the commands in order
			(async () => {
				await this.renderer.addClass(this.activeTabIndicator, 'no-transition'); //remove the animation
				await new Promise(resolve => {
					setTimeout(() => {
						this.slideTo(this.activeIndex, 0); //set initial slide
						resolve(true);
					}, 20);
					
				});

				//bring back the animation
				this.renderer.removeClass(this.activeTabIndicator, 'no-transition');
			})();
		}

		//update the active tab indicator when the slide changes
		this.slideChanged$ = this.slides.ionSlideWillChange.subscribe(event => {
			this.setActiveTab(this.slides.getActiveIndex());
		});
	}

	/**
	 * Destroy subscriptions
	 */
	ngOnDestroy() {
		this.slideChanged$.unsubscribe();
	}

	/**
	 * Get all tabs
	 */
	getTabs() {
		setTimeout(() => {
			this.tabsEl = this.el.nativeElement.querySelectorAll('.col');
		});
	}

	/**
	 * Set the active tab indicator same as the tab
	 */
	updateTabWidth() {
		setTimeout(() => {
			this.tabWidth = this.el.nativeElement.querySelector('.col').offsetWidth;
			this.renderer.setStyle(this.activeTabIndicator, 'width', this.tabWidth + 'px');
		});
	}

	/**
	 * Set slide active index and transition to the specific slide
	 * 
	 * @param index (number) - the index number of the slide (starts from 0)
	 * @param duration (number) - duration of the transition (in ms)
	 */
	slideTo(index, duration: number = 500) {
		this.activeIndex = index;
		this.slides.slideTo(index, duration);
	}

	/**
	 * Set the active tab and move the active tab indicator
	 * 
	 * @param index (number) - the index number of the tab
	 */
	setActiveTab(index) {
		let activeTab = typeof this.tabsEl[index] != 'undefined' ? this.tabsEl[index] : null;

		if (activeTab) {
			this.activeIndex = index;
			this.updateTabIndicatorPosX(activeTab.offsetLeft);
		}
	}

	/**
	 * Update the position of the active tab indicator
	 * 
	 * @param xPos (number) - the horizontal position
	 */
	updateTabIndicatorPosX(xPos: number) {
		this.renderer.setStyle(this.activeTabIndicator, 'left', xPos + 'px');
	}
}
