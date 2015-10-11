define(['photos', 'FrameTimer'], function definePhotoLoader(photos, FrameTimer){
	return {

		_pageIndex: 0,

		_photoIndex: 0,

		_loadCount: 0,

		_descriptionAttribute: 'data-description',

		_shrinkClass: 'shrink',

		_supportedTransitionProperties: {
			WebkitTransition: "webkitTransitionEnd",
			MozTransition: "transitionend",
			MsTransition: "transitionend",
			OTransition: "transitionend",
			transition: "transitionend"
		},


		_shrink: function _shrink(index){
			var scaler = this._getScaler(index);
			scaler.classList.add(this._shrinkClass);
		},


		_getScaler: function _getScaler(index){
			var scaler = this._scalers[index];
			var parent;
			var style;
			var supportedTransitionProperties;

			if( ! scaler ){
				parent = this._pages[index].parentNode;

				while( ! parent.classList.contains('scaler') ){
					parent = parent.parentNode;
				}

				this._scalers[index] = scaler = parent;

				if(this._supportedTransitionEvent === undefined){
					style = document.body.style;
					supportedTransitionProperties = this._supportedTransitionProperties;

					Object.keys(supportedTransitionProperties).forEach(
						(function checkProperty(property){
							if(style[property] !== undefined){
								this._supportedTransitionEvent = supportedTransitionProperties[property];
							}
						}).bind(this)
					);

					if( ! this._supportedTransitionEvent ){
						throw "[PhotoLoader] - _getScaler - \"transitionend\" event is not supported!";
					}
				}

				scaler.addEventListener(
					this._supportedTransitionEvent,
					this._expand.bind(this, index),
					false
				);
			}

			return scaler;
		},


		_expand: function _expand(index){
			var scaler = this._scalers[index];
			var loader;

			if(scaler.classList.contains(this._shrinkClass)){
				loader = this._loaders[index];

				this._pages[index].src = loader.src;
				this._descriptions[index].textContent = loader[this._descriptionAttribute];

				scaler.classList.remove("hidden");
				scaler.classList.remove(this._shrinkClass);
			}
		},


		_loadAll: function _loadAll(){
			if(++this._loadCount === this._loaders.length){
				this._loadCount = 0;
				Object.create(FrameTimer).after(this._frames).run(this._next.bind(this));
			}
		},


		_next: function _next(){
			this._loaders.forEach(function loadPhoto(loader){
				var nextPhoto = this._getNextPhoto();
				loader.src = (this._prefix ? this._prefix : "") + nextPhoto.file;
				loader[this._descriptionAttribute] = nextPhoto.description;
			}.bind(this));
		},


		_getNextPhoto: function _getNextPhoto(){
			var nextPhoto = photos[this._photoIndex];
			this._photoIndex = (this._photoIndex + 1) % photos.length;
			return nextPhoto;
		},


		init: function init(pages, descriptions, frames, prefix){
			var loaders = this._loaders = [];
			var loader;

			this._pages = pages;
			this._descriptions = descriptions;
			this._scalers = [];
			this._frames = frames || 600;
			this._prefix = prefix;

			for(var index = pages.length; index--;){
				loader = new Image();
				loader.addEventListener('load', this._shrink.bind(this, index), false);
				loader.addEventListener('load', this._loadAll.bind(this), false);
				loaders.unshift(loader);
			}

			this._next();
		}

	};
});