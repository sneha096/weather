var tz = require('C:/Users/snehalatha/Desktop/child process/timeZone.js');

process.on('message', (body)=>{
    process.send(JSON.parse(JSON.stringify(tz.nextNhoursWeather(body.city_Date_Time_Name, body.hours, tz.allTimeZones()))));
});