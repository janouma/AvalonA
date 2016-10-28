if( ! console.debug ){
	console.debug = console.log;
}

window.GreenSockGlobals = {};

require.config({
	baseUrl: 'js',

	paths: {
		tweenmax: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.0/TweenMax.min',
		tweenlite: 'shim/tweenlite',
		GSEases: 'shim/gs_eases',
		AvalonA: 'avalona/AvalonA.min',
		AvalonAnimation: 'avalona/AvalonAnimation.min',
		ResponsiveImageLoader: 'modules/ResponsiveImageLoader',
		FrameTimer: 'modules/FrameTimer',
		photos: '../photos/data',
		PhotoLoader: 'modules/PhotoLoader',
		SpeedTester: 'avalona/SpeedTester.min'
	},

	shim: {
		tweenmax: {
			exports: 'window.GreenSockGlobals.TweenMax'
		}
	}
});

require(
	[
		'AvalonA',
		'AvalonAnimation',
		'ResponsiveImageLoader',
		'FrameTimer',
		'PhotoLoader',
		'SpeedTester'
	],
	function startApp(
		AvalonA,
		AvalonAnimation,
		ResponsiveImageLoader,
		FrameTimer,
		PhotoLoader,
		SpeedTester
	) {
		/********************
		* Init steps
		* *******************/
		var imgLoader = Object.create(ResponsiveImageLoader);
		var pages = Array.prototype.slice.call(document.querySelectorAll('img.front.page'));

		imgLoader.basenames = [
			'lightfx',
			'black-hole'
		];

		imgLoader.mediaQuery = 'screen and (min-width: 42em)';
		imgLoader.init();



		/********************
		* Start Avalon (A)
		* *******************/

		document.querySelector(".preview").classList.add("halo");

		new SpeedTester(3).run().oncomplete(startAvalonA);

		function startAvalonA(speedTestResults) {
			var avalona;
			var requiredFps = 40;
			var zoom;
			var overlay;
			var tapEventName = "touchstart" in window ? "tap" : "click" ;

			var options = {
				tAttr: 'transform',
				fx: function fx(rotation) { return rotation * 0.5; },
				fy: function fy(rotation) { return rotation * 0.15; }
			};

			if(speedTestResults.fps >= requiredFps){
				options.animation = AvalonAnimation.Atom({
					duration: 10,
					selector: '.gravity, .group-hole',
					axis: ['z']
				});
			}

			avalona = AvalonA('t3d-frame', 't3d-layer', options);

			avalona.onenable = function onenable() {
				var descriptions = Array.prototype.slice.call(document.querySelectorAll('.sheet .description'));
				var framesTimeout = 900;
				var portfolioScaler = document.querySelector('.portfolio-scaler');
				var allPages = Array.prototype.slice.call(document.querySelectorAll(".page"));

				portfolioScaler.classList.remove('hidden');
				portfolioScaler.classList.remove('shrink');

				Object.create(PhotoLoader).init(pages, descriptions, framesTimeout);

				allPages.forEach(function addClickEventTo(page){
					page.addEventListener(
						tapEventName,
						function zoomPhoto(){
							var frontPage;

							if(this.classList.contains("front")){
								frontPage = this;
							}else{
								frontPage = this.nextElementSibling;
							}

							avalona.freeze();
							zoom.src = frontPage.src;
							overlay.classList.remove("hidden");
							zoom.classList.remove("shrink");
							overlay.classList.remove("no-opacity");
						},
						false
					);
				});
			};

			overlay = document.querySelector(".overlay");
			zoom = document.querySelector(".zoom");
			zoom.addEventListener(
				tapEventName,
				function closeZoom(){
					zoom.classList.add("shrink");
					overlay.classList.add("no-opacity");
					overlay.classList.add("hidden");
					this.src = "";
					avalona.release();
				},
				false
			);

			avalona.enable();

			/********************
			* Update Avalon (A)
			* *******************/

			Object.create(FrameTimer)
				.every(300)
				.run(function updateVortex() {
					avalona.layers['.black-hole']
						.forEach(function update(layer, index) {
							layer.rx *= -1;
							layer.ry *= -1;
							layer.refresh();
						});
				});
		}
	}
);