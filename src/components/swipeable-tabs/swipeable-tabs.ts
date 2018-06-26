import { Component, Input, OnInit, OnDestroy, ElementRef, Renderer2, ContentChild, HostListener } from '@angular/core';
import { Slides } from 'ionic-angular';

@Component({
	selector: 'swipeable-tabs',
	templateUrl: 'swipeable-tabs.html'
})
export class SwipeableTabs implements OnInit, OnDestroy {
	@Input('tabs') tabs: Array<string>;
	@Input('activeIndex') activeIndex: number = 0;
	@Input('slidesFullHeight') slidesFullHeight: any = true;
	@ContentChild(Slides) slides: Slides;
	@HostListener('window:resize') onWindowResize() {
		//update the active tab indicator when the window has been resized
		this.setActiveTab();
	}

	public activeTabIndicator: HTMLElement;
	public tabsEl: Array<HTMLElement> = [];
	public slideWidth: number;
	public slideChanged$;

	constructor(
		public el: ElementRef,
		public renderer: Renderer2
	) {}

	ngOnInit() {
		//make sure we have assigned the correct height
		setTimeout(() => {
			this.setActiveTab();
		}, 1000);
	}

	/**
	 * Update the values
	 */
	ngOnChanges() {
		setTimeout(() => {
			this.setActiveTab();
		}, 100);
	}

	/**
	 * All input will be initilized after this function so
	 * we start setting up everything here
	 */
	ngAfterViewInit() {
		//set the height of the slides
		if (String(this.slidesFullHeight).toLowerCase() == 'false') {
			this.renderer.addClass(this.el.nativeElement, 'slides-height-auto');
		}
	
		//get the active tab indicator dom element
		this.activeTabIndicator = this.el.nativeElement.querySelector('.active-tab-indicator');

		//set active tab
		(async () => {
			//get each tab element
			await new Promise(resolve => {
				setTimeout(() => {
					this.getTabs();
					resolve(true);
				}, 100);
			});

			if (this.activeIndex != 0) {
			//make sure we run the commands in order
				await this.renderer.addClass(this.activeTabIndicator, 'no-transition'); //remove the animation
				await new Promise(resolve => {
					setTimeout(() => {
						this.slideTo(this.activeIndex, 0); //set initial slide
						resolve(true);
					}, 200);
					
				});

				//bring back the animation
				await this.renderer.removeClass(this.activeTabIndicator, 'no-transition');
			}
			
			//set the active tab indicator width
			this.updateActiveTabIndicatorWidth();
			this.updateSlidesHeight();
		})();

		//update the active tab indicator when the slide changes
		this.slideChanged$ = this.slides.ionSlideWillChange.subscribe(event => {
			this.activeIndex = this.slides.getActiveIndex();
			this.setActiveTab();
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
		this.tabsEl = [];
		let tabsEl = this.el.nativeElement.querySelectorAll('.swipeable-tabs-header .col');

		if (tabsEl.length) {
			tabsEl.forEach(tab => {
				if (tab.innerText.trim() != '') {
					this.tabsEl.push(tab);
				}
			});
		}
	}

	/**
	 * Set slide active index and transition to the specific slide
	 * 
	 * @param index (number) - the index number of the slide (starts from 0)
	 * @param duration (number) - duration of the transition (in ms)
	 */
	slideTo(index, duration: number = 500) {
		this.slides.slideTo(index, duration);
	}

	/**
	 * Set the active tab and move the active tab indicator
	 * 
	 * @param index (number) - the index number of the tab
	 */
	async setActiveTab() {
		await this.getTabs(); //make sure we have tab element
		let activeTab = typeof this.tabsEl[this.activeIndex] != 'undefined' ? this.tabsEl[this.activeIndex] : null;

		if (activeTab) {
			this.updateActiveTabIndicatorWidth();
			this.updateTabIndicatorPosX(activeTab.offsetLeft);
			this.updateSlidesHeight();
		}
	}

	/**
	 * Set the active tab indicator same as the tab
	 */
	updateActiveTabIndicatorWidth() {
		if (typeof this.tabsEl[0] != 'undefined') {
			this.renderer.setStyle(this.activeTabIndicator, 'width', this.tabsEl[0].offsetWidth + 'px');
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

	/**
	 * Update the slide wrapper height same as the active slide when
	 * the user set the slidesFullHeight to false
	 * 
	 * @param activeTab (object) - the dom element of the active tab
	 */
	updateSlidesHeight() {
		if (String(this.slidesFullHeight).toLowerCase() == 'false') {
			let slides = typeof this.slides._slides != 'undefined' ? this.slides._slides : [];
			let activeSlide = typeof slides[this.activeIndex] != 'undefined' ? slides[this.activeIndex] : false;

			if (slides && activeSlide) {
				let slideHeight = activeSlide.querySelector('.slide-zoom').clientHeight;

				if (slideHeight) {
					this.renderer.setStyle(this.slides.container, 'height', slideHeight + 'px');
				}
			}
		}
	}
}
