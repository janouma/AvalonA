(function() {
  var endMessage, i, j, speedThreshold, startTime, timeEnlapsed, _i, _j;

  speedThreshold = 5000;

  startTime = new Date().getTime();

  for (i = _i = 0; _i <= 10; i = ++_i) {
    for (j = _j = 0; _j <= 100000000; j = ++_j) {
      true;
    }
  }

  timeEnlapsed = new Date().getTime() - startTime;

  endMessage = timeEnlapsed <= speedThreshold ? JSON.stringify({
    speed: 'high',
    timeEnlapsed: timeEnlapsed
  }) : JSON.stringify({
    speed: 'low',
    timeEnlapsed: timeEnlapsed
  });

  postMessage(endMessage);

}).call(this);
