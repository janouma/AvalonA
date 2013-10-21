speedThreshold = 5000 # 3000 ~ 5000

startTime = new Date().getTime()

for i in [0..10]
  true for j in [0..100000000]

timeEnlapsed = new Date().getTime() - startTime

endMessage = if timeEnlapsed <= speedThreshold
  JSON.stringify(speed: 'high', timeEnlapsed: timeEnlapsed)
else
  JSON.stringify(speed: 'low', timeEnlapsed: timeEnlapsed)

postMessage(endMessage)