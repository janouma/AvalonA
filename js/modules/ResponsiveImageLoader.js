define(function defineResponsiveImageLoader(){
	var ResponsiveImageLoader = {

		get basenames(){ return this._basenames.slice(); },

		set basenames(basenames){ this._basenames = basenames.slice(); },

		get mediaQuery(){ return this._mediaQuery; },

		set mediaQuery(mediaQuery){ this._mediaQuery = mediaQuery; },


		_applyMediaQuery: function _applyMediaQuery(){
			var mediaQuery = this._mediaQuery;
			if(mediaQuery && mediaQuery.trim().length > 0
				&& matchMedia(mediaQuery).matches){
					this._loadImages();
			}
		},


		_loadImages: function _loadImages(){
			var basenames = this._basenames;
			if( basenames && basenames.length > 0){
				basenames.forEach(function loadHDImage(basename){
					var extension = '.png';
					var sdFileName = basename + '-sd' + extension;
					var hdPath = 'images/' + basename + extension;
					var imageElement = new Image();

					imageElement.addEventListener(
						'load',
						function onImageLoad() {
							var elementList = document.querySelectorAll('img[src$="' + sdFileName + '"]');
							Array.prototype.slice.call(elementList)
								.forEach(function updateSrc(element) {
									element.src = hdPath;
								});
						},
						false
					);

					imageElement.src = hdPath;
				});
			}
		},


		init: function init(){
			window.matchMedia = window.matchMedia || window.msMatchMedia;
			window.addEventListener('resize', this._applyMediaQuery.bind(this), false);
			this._applyMediaQuery();
		}

	};

	return ResponsiveImageLoader;
});