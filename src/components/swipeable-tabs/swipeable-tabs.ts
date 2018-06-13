import { Component, Input, OnInit, OnDestroy, ElementRef, Renderer2, ContentChild, Output, EventEmitter, HostListener } from '@angular/core';
import { Slides } from 'ionic-angular';

@Component({
	selector: 'swipeable-tabs',
	templateUrl: 'swipeable-tabs.html'
})
export class SwipeableTabsComponent implements OnInit, OnDestroy {
	@Input('tabs') tabs: Array<string>;
	@Input('activeIndex') activeIndex: number;
	@Input('slidesFullHeight') slidesFullHeight: any = true;
	@ContentChild(Slides) slides: Slides;
	@HostListener('window:resize') onWindowResize() {
		this.updateTabWidth();
	}

	public activeTabIndicator: HTMLElement;
	public tabsEl: Array<HTMLElement>;
	public tabsHeader: HTMLElement;
	public tabWidth: number;
	public slideWidth: number;
	public slideContainer: HTMLElement;
	public slideDrag$;
	public slideChanged$;
	public slideMouseUp$;
	public slideTouchEnd$;

	constructor(
		public el: ElementRef,
		public renderer: Renderer2
	) {
		
	}

	ngOnInit() {}

	ngAfterViewInit() {
		if (!this.activeIndex) {
			this.activeIndex = 0;
		}
		
		if (String(this.slidesFullHeight).toLowerCase() == 'false') {
			this.renderer.addClass(this.el.nativeElement, 'slides-height-auto');
		}
	
		this.tabsHeader = this.el.nativeElement.querySelector('.swipeable-tabs-header');
		this.activeTabIndicator = this.el.nativeElement.querySelector('.active-tab-indicator');
		this.slideContainer = this.el.nativeElement.querySelector('.swiper-container');

		//set active tab
		if (this.activeIndex != 0) {
			this.renderer.addClass(this.activeTabIndicator, 'no-transition'); //remove the animation

			setTimeout(() => {
				this.slideTo(this.activeIndex, 0);
			}, 20);

			//bring back the animation
			setTimeout(() => {
				this.renderer.removeClass(this.activeTabIndicator, 'no-transition');
			}, 200);
		}

		//get the tabs element
		this.getTabs();

		//set the tab width
		this.updateTabWidth();

		//listen to slide change event
		this.slideChanged$ = this.slides.ionSlideWillChange.subscribe(event => {
			//update the active tab indicator when the slide changes
			this.setActiveTab(this.slides.getActiveIndex());
		});
		
		/* TODO: update the active tab indicator position while swiping
		//listen to slide drag event
		this.slideDrag$ = this.slides.ionSlideDrag.subscribe(event => {
			let container = event.container;
			let translated = [];
			let scrollPos = this.getPosX(container);
			let speed = this.tabWidth / container.offsetWidth;
			let indicatorPos = speed * Math.abs(scrollPos);

			this.updateTabIndicatorPosX(indicatorPos);
		});

		//listen to mouse up event to revert back to original position
		this.slideMouseUp$ = this.renderer.listen(this.slideContainer, 'mouseup', e => {
			let activeSlideIndex = this.slides.getActiveIndex();
			let containerWidth = this.slideContainer.offsetWidth;
			let posX = this.getPosX(this.slideContainer); // + (activeSlideIndex * containerWidth) + this.tabWidth;

			if (posX >= 0) {
				this.updateTabIndicatorPosX(posX);
			}
		});

		//listen to touchend event to revert back to original position
		this.slideTouchEnd$ = this.renderer.listen(this.slideContainer, 'touchend', e => {
			let activeSlideIndex = this.slides.getActiveIndex();
			let containerWidth = this.slideContainer.offsetWidth;
			let posX = this.getPosX(this.slideContainer); // + (activeSlideIndex * containerWidth) + this.tabWidth;

			if (posX >= 0) {
				this.updateTabIndicatorPosX(posX);
			}
		});
		*/
	}

	ngOnDestroy() {
		this.slideChanged$.unsubscribe();
		/*
		this.slideDrag$.unsubscribe();
		this.slideMouseUp$.unsubscribe();
		this.slideTouchEnd$.unsubscribe();
		*/
	}

	getTabs() {
		setTimeout(() => {
			this.tabsEl = this.el.nativeElement.querySelectorAll('.col');
		});
	}

	updateTabWidth() {
		setTimeout(() => {
			this.tabWidth = this.el.nativeElement.querySelector('.col').offsetWidth;
			this.renderer.setStyle(this.activeTabIndicator, 'width', this.tabWidth + 'px');
		});
	}

	slideTo(index, duration: number = 500) {
		this.activeIndex = index;
		this.slides.slideTo(index, duration);
	}

	setActiveTab(index) {
		let activeTab = this.tabsEl[index];

		if (activeTab) {
			this.activeIndex = index;
			this.updateTabIndicatorPosX(activeTab.offsetLeft);
		}
	}

	updateTabIndicatorPosX(xPos: number) {
		this.renderer.setStyle(this.activeTabIndicator, 'left', xPos + 'px');
	}

	getPosX(el: HTMLElement) {
		let scrollPos = 0;
		let translated = [];
		let firstChild = <HTMLElement>el.firstChild;

		if (firstChild.style.transform) {
			translated = firstChild.style.transform.split(/\w+\(|\);?/);
			
			//move the active tab indicator when the slide has been dragged
			if (translated[1] && translated[1].length) {
				translated = translated[1].split(/,\s?/g);
				scrollPos = parseInt(translated[0]);
			}
		}

		return scrollPos;
	}
}
