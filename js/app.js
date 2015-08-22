window.GreenSockGlobals = {};

require.config({
	baseUrl: 'js',

	paths: {
		tweenmax: 'http://cdnjs.cloudflare.com/ajax/libs/gsap/1.17.0/TweenMax.min',
		tweenlite: 'shim/tweenlite',
		GSEases: 'shim/gs_eases',
		AvalonA: 'avalona/AvalonA.min',
		AvalonAnimation: 'avalona/AvalonAnimation.min',
		ResponsiveImageLoader: 'modules/ResponsiveImageLoader',
		FrameTimer: 'modules/FrameTimer'
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
		'FrameTimer'
	],
	function startApp(
		AvalonA,
		AvalonAnimation,
		ResponsiveImageLoader,
		FrameTimer
	) {
		/********************
		* Init steps
		* *******************/
		var imgLoader = Object.create(ResponsiveImageLoader);

		imgLoader.basenames = [
			'lightfx',
			'black-hole'
		];

		imgLoader.mediaQuery = 'screen and (min-width: 42em)';
		imgLoader.init();

		/********************
		* Start Avalon (A)
		* *******************/

		var avalona = AvalonA('t3d-frame', 't3d-layer', {
			tAttr: 'transform',
			fx: function fx(rotation) { return rotation * 0.5; },
			fy: function fy(rotation) { return rotation * 0.15; },

			animation: AvalonAnimation.Atom({
				duration: 10,
				selector: '.gravity',
				axis: ['z']
			})
		});

		avalona.enable();

		/********************
		* Update Avalon (A)
		* *******************/

		Object.create(FrameTimer)
			.every(180)
			.run(function updateVortex(){
				avalona.layers['.black-hole']
					.forEach(function update(layer){
						layer.rx *= -1;
						layer.ry *= -1;
						layer.refresh();
					});
			});

	}
);