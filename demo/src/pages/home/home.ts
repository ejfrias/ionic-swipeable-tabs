import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
})
export class HomePage {
	public tabs: Array<string>;
	public slides: any;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.slides = [
			{
				tabTitle: "Welcome",
				title: "Welcome to the Docs!",
				description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
				image: "assets/imgs/ica-slidebox-img-1.png",
			},
			{
				tabTitle: "Ionic",
				title: "What is Ionic?",
				description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
				image: "assets/imgs/ica-slidebox-img-2.png",
			},
			{
				tabTitle: "Ionic Cloud",
				title: "What is Ionic Cloud?",
				description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
				image: "assets/imgs/ica-slidebox-img-3.png",
			}
		];

		this.tabs = this.slides.map(el => el.tabTitle);
		this.tabs.push('Play');
	}
}
