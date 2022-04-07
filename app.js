const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const app = express();
const { fork } = require('child_process');
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT);
const io = require('socket.io')(server);

let socketsConected = new Set();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname + "/public")));

app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get("/all-timezone-cities", (req, res) => {
    const myChildProcess = fork('public/js/child.js');
    myChildProcess.on('message', (data)=>{
        res.json(data);
    });     
    myChildProcess.send(req.url); 
});

app.get("/cityName", (req, res) => {
    const myChildProcess2 = fork('public/js/child2.js');
    var city = req.query.city;
    if (city) {
        myChildProcess2.on('message', (data)=>{
            res.json(data);
        });        
        myChildProcess2.send(req.query.city);
    }
});

app.post("/hourly-forecast", (req, res) => {
    const myChildProcess3 = fork('public/js/child3.js');
    let cityDTN = req.body.city_Date_Time_Name;
    let hours = req.body.hours;
    if (cityDTN && hours) {
        myChildProcess3.on('message', (data)=>{
            res.json(data);
        });        
        myChildProcess3.send(req.body);
    }
    else {
        res.status(404).json({ Error: "Ooops! An error occured! Checkout after sometime. Sorry for the inconvenience:(" })
    }
});

io.on('connection', (socket) => {
    socketsConected.add(socket.id)

    socket.on('disconnect', () => {
        socketsConected.delete(socket.id)
    })

    socket.on('message', (data) => {
        socket.broadcast.emit('chat-message', data)
    })

 /*   socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
    })*/
});












/*const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const port = 9000;

app.use(express.static(path.join(__dirname + "/public")));

const io = new Server(server);

app.get('/*', function (req, res) {
    if (req.url === '/') {
        res.sendFile(path.join(__dirname, '/views/index.html'));
    }
    /*if(req.url === '/chat.html'){
        res.sendFile(path.join(__dirname, '/views/chat.html'));
    }
    else {
        res.end("Ooops! An error occured! Checkout after sometime. Sorry for the inconvenience:(");
    }
});


io.on('connection', (socket) =>{
    socket.on('chat', (data)=>{
        console.log(data);
        io.sockets.emit('chat', data);
    });

    socket.on('typing', (data)=>{
        socket.broadcast.emit('typing', data);
    });
});




*/