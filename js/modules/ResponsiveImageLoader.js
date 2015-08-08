define(function defineResponsiveImageLoader(){
	return {
		get basenames(){ return this._basenames.slice(); },

		set basenames(basenames){ this._basenames = basenames.slice(); },

		get mediaQuery(){ return this._mediaQuery; },

		set mediaQuery(mediaQuery){ this._mediaQuery = mediaQuery; },


		_applyMediaQuery: function _applyMediaQuery(){
			var mediaQuery = this._mediaQuery;
			if(mediaQuery && mediaQuery.trim().length > 0
				&& matchMedia(mediaQuery).matches){
					console.debug('ResponsiveImageLoader - _applyMediaQuery - loading HD images');
					this._loadImages();
					window.removeEventListener('resize', this.__this_applyMediaQuery);
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
			var applyMediaQuery = this.__this_applyMediaQuery = this._applyMediaQuery.bind(this);

			window.matchMedia = window.matchMedia || window.msMatchMedia;
			window.addEventListener('resize', applyMediaQuery, false);
			applyMediaQuery();
		}

	};
});