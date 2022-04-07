/*process.on('message', (msg)=>{
    var nxtdata = getNextFiveHrData(msg);
    console.log('Message from parent: '+msg);
});*/
var weatherResult;

var tz = require('C:/Users/snehalatha/Desktop/child process/timeZone.js');

process.on('message', (msg)=>{
    if(msg === '/all-timezone-cities'){
        process.send(JSON.parse(JSON.stringify(tz.allTimeZones())));
    }
});