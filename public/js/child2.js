var tz = require('C:/Users/snehalatha/Desktop/child process/timeZone.js');

process.on('message', (cityName)=>{
        process.send(JSON.parse(JSON.stringify(tz.timeForOneCity(cityName))));
});