window.GreenSockGlobals = {};

require.config({
	baseUrl: 'js',

	paths: {
		tweenmax: 'greensock/TweenMax.min',
		tweenlite: 'shim/tweenlite',
		GSEases: 'shim/gs_eases',
		AvalonA: 'avalona/AvalonA.min',
		AvalonAnimation: 'avalona/AvalonAnimation.min'
	},

	shim: {
		tweenmax: {
			exports: 'window.GreenSockGlobals.TweenMax'
		}
	}
});

require(
	['AvalonA', 'AvalonAnimation'],
	function startApp(AvalonA, AvalonAnimation) {
		/********************
		* Init steps
		* *******************/

		function loadHdImages() {
			[
				'lightfx',
				'black-hole'
			].forEach(function loadHdImage(imageBasename) {
				var imageExtension = '.png';
				var sdImageFile = imageBasename + '-sd' + imageExtension;
				var hdImagePath = 'images/' + imageBasename + imageExtension;
				var imageElement = new Image();

				imageElement.addEventListener(
					'load',
					function onImageLoad() {
						var elementList = document.querySelectorAll('img[src$="' + sdImageFile + '"]');
						Array.prototype.slice.call(elementList)
							.forEach(function updateSrc(element) {
								element.src = hdImagePath;
							});
					},
					false
				);

				imageElement.src = hdImagePath;
			});
		}


		window.matchMedia = window.matchMedia || window.msMatchMedia;

		function applyMediaQueries() {
			if (matchMedia('screen and (min-width: 42em)').matches) {
				loadHdImages();
			}
		}


		applyMediaQueries();

		window.addEventListener('resize', applyMediaQueries, false);


		/********************
		* Start Avalon (A)
		* *******************/

		AvalonA('t3d-frame', 't3d-layer', {
			tAttr: 'transform',
			fx: function fx(rotation) { return rotation * 0.5; },
			fy: function fy(rotation) { return rotation * 0.15; },

			animation: AvalonAnimation.Atom({
				duration: 10,
				selector: '.gravity',
				axis: ['z']
			})
		}).enable();
	}
);