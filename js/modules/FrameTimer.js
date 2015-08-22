define(function defineFrameTimer(){
	return {

		_frameCount: 0,

		_Ø: Object.create(null),


		_after: function _after(repeat, delay){
			this._setDelay(delay);
			this._repeat = repeat;
			this._getRequestAnimationFrame()(this._frame.bind(this));
		},


		_frame: function _frame(){
			var frameCount;

			this._timeoutReached = false;

			if( ! this._stopped ){
				frameCount = ++this._frameCount;

				if(frameCount === this._delay){
					this._frameCount = 0;
					this._timeoutReached = true;
					! this._repeat && (this._stopped = true);
					this._callback.call(this._Ø);
				}

				if( ! this.ended ){
					this._getRequestAnimationFrame()(this._frame.bind(this));
				}
			}else{
				this._frameCount = 0;
			}
		},


		_setDelay: function _setDelay(delay){
			if(typeof delay !== 'number' || isNaN(delay) || delay <= 0){
				throw 'delay argument must be a strictly positive number. Actual ' + delay;
			}

			this._delay = Math.ceil(delay);
		},


		_getRequestAnimationFrame: function _getRequestAnimationFrame(){
			var requestAnimationFrame = this._requestAnimationFrame = window.requestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.oRequestAnimationFrame;

			if(requestAnimationFrame){
				this._getRequestAnimationFrame = function _getRequestAnimationFrame(){
					return this._requestAnimationFrame;
				};

				return requestAnimationFrame;
			}else{
				this._getRequestAnimationFrame = function _getRequestAnimationFrame(){
					throw 'requestAnimationFrame is not supported';
				};

				throw 'requestAnimationFrame is not supported';
			}
		},


		get initialized(){
			return this._callback && this._delay;
		},


		get running(){
			return this.initialized && ! this._stopped;
		},


		get ended(){
			return this._timeoutReached && ! this._repeat;
		},


		run: function run(callback){
			if(this.initialized){
				throw 'timer is already initialized';
			}

			if(typeof callback !== 'function'){
				throw 'callback argument must be a function. Actual ' + callback;
			}

			this._callback = callback;

			if( ! this._delay ){
				this.every = this._after.bind(this, true);
				this.after = this._after.bind(this, false);
			}else{
				this.every = this.after = (function after(){
					var timerType = this._repeat ? 'interval' : 'timeout';
					throw [timerType, 'delay has already been set to', this._delay].join(' ');
				}).bind(this);

				this._getRequestAnimationFrame()(this._frame.bind(this));
			}

			return {
				every: this.every,
				after: this.after,
			};
		},


		every: function every(delay){
			this._setDelay(delay);
			this._repeat = true;
		},


		after: function after(delay){
			this._setDelay(delay);
			this._repeat = false;
		},


		stop: function stop(){
			this._stopped = true;
		},


		resume: function resume(){
			if( ! this.initialized ){
				throw 'timer is not yet initialized';
			}

			if(this._stopped){
				if( ! this.ended ){
					this._stopped = false;
					this._getRequestAnimationFrame()(this._frame.bind(this));
				}else{
					throw 'one time timer has already ended';
				}
			}else{
				console.warn('timer is already running');
			}
		}

	};
});