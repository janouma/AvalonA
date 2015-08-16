define(function defineFrameTimer(){
	return {

		_frameCount: 0,

		_Ø: Object.create(null),

		_requestAnimationFrame: window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.oRequestAnimationFrame,


		_every: function _every(delay){
			var requestAnimationFrame = this._requestAnimationFrame;

			if(typeof delay !== 'number' || isNaN(delay) || delay <= 0){
				throw 'delay argument must be a strictly positive number. Actual ' + delay;
			}

			this._delay = Math.ceil(delay);

			if(requestAnimationFrame){
				requestAnimationFrame(this._frame.bind(this));
			}else{
				console.error('requestAnimationFrame is not supported');
			}
		},


		_frame: function _frame(){
			var requestAnimationFrame = this._requestAnimationFrame;
			var frameCount;

			if( ! this._stopped ){
				frameCount = ++this._frameCount;

				if(frameCount === this._delay){
					this._frameCount = 0;
					this._callback.call(this._Ø);
				}

				requestAnimationFrame(this._frame.bind(this));
			}else{
				this._frameCount = 0;
			}
		},


		get initialized(){
			return !!this._callback;
		},


		get running(){
			return this.initialized && ! this._stopped;
		},


		run: function run(callback){
			if(this.initialized){
				throw 'timer is already initialized';
			}

			if(typeof callback !== 'function'){
				throw 'callback argument must be a function. Actual ' + callback;
			}

			this._callback = callback;

			return {
				every: this._every.bind(this)
			};
		},


		stop: function stop(){
			this._stopped = true;
		},


		resume: function resume(){
			var requestAnimationFrame = this._requestAnimationFrame;

			if( ! this.initialized ){
				throw 'timer is not yet initialized';
			}

			if(this._stopped){
				this._stopped = false;
				requestAnimationFrame(this._frame.bind(this));
			}else{
				console.warn('timer is already running');
			}
		}

	};
});