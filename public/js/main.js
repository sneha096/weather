const socket = io();

const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message');
const messageInput = document.getElementById('message-input');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();
});

function sendMessage() {
  if (messageInput.value === '') return
  const data = {
    name: nameInput.value,
    message: messageInput.value
  }
  socket.emit('message', data)
  addMessageToUI(true, data)
  messageInput.value = ''
}

socket.on('chat-message', (data) => {
  addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
  //clearFeedback();
  const element = `<li class="${isOwnMessage ? 'message-right' : 'message-left'}">
          <p class="message">
            <span>${data.name}:&nbsp; ${data.message} </span>
          </p>
        </li>`;

  messageContainer.innerHTML += element;
  scrollToBottom()
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}











/*
messageInput.addEventListener('focus', (e) => {
  socket.emit('feedback', {
    feedback: `${nameInput.value} is typing a message`
  });
});

messageInput.addEventListener('keypress', (e) => {
  socket.emit('feedback', {
    feedback: `${nameInput.value} is typing a message`
  });
});
messageInput.addEventListener('blur', (e) => {
  socket.emit('feedback', {
    feedback: ''
  });
});

socket.on('feedback', (data) => {
  clearFeedback()
  const element = `<li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>`;
  messageContainer.innerHTML += element;
});

function clearFeedback() {
  document.querySelectorAll('li.message-feedback').forEach((element) => {
    element.parentNode.removeChild(element)
  });
}

*/














/*var socket = io.connect('http://localhost:5000');

var message = document.getElementById('message');
var handle = document.getElementById('handle');
var send = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');

send.addEventListener('click', ()=> {
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";
});

message.addEventListener('keypress', ()=> {
    socket.emit('typing', handle.value);
});

socket.on('chat', (data)=>{
    feedback.innerHTML = "";
    output.innerHTML += '<p><strong>'+ data.handle + ':</strong>' + data.message + '</p>';
});

socket.on('typing', (data)=>{
    feedback.innerHTML = '<p><em>' + data + 'is typing...</em></p>';
});*/