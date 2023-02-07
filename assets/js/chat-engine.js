// storing DOM elements in variables
const form = document.getElementById('form');
const msg = document.getElementById('msg');
const messages = document.querySelector('.chat');

// function to append messages in chat container
const append = (msg, position) => {
    const message = document.createElement('span');
    message.classList.add('msg');
    message.classList.add(position);
    message.innerText = msg;
    messages.append(message);
}


class ChatEngine{
    constructor(chatBoxId, username){
        this.chatBox = document.getElementById(chatBoxId);
        this.username = username

        this.socket = io.connect('http://localhost:5000');

        if(this.username){
            this.connectionHandler();
        }
    }

    connectionHandler(){

        let self = this;

        this.socket.on('connect', ()=>{
            console.log('connection established');

            self.socket.emit('join-room', {
                username: self.username,
                chatroom: 'SM_APP'
            })

            self.socket.on('user-joined', username=>{
                console.log(username, " joined the chat")
            })

            form.addEventListener('submit', (e) => {
                e.preventDefault()
                const msg = document.getElementById('msg')
                if (msg.value) {
                    self.socket.emit('send', {username: self.username, msg: msg.value, chatroom: "SM_APP"});
                    msg.value = '';
                }
            })

            self.socket.on('recieve', data=>{
                if(data.username === self.username){
                    append(`You: ${data.msg}`, 'right');
                }else{
                    append(`${data.username}: ${data.msg}`, 'left');
                }
            })

        })
    }

}












// const socket = io('http://localhost:6000');




// // asking user his/her name
// const name = '<%= user.username %>';

// // telling the server, new user has joined
// socket.emit('new-user-joined', name);

// // letting know the chat, new user has joined
// socket.on('user-joined', name => {
//     append(`${name} joined the chat`, 'center');
// });

// // appending message to message container on recieving a message
// socket.on('recieve', data => {
//     append(`${data.user} : ${data.message} `, 'left');
// });

// // letting know the chat, a user has left the chat
// socket.on('left', user => {
//     append(`${user} left the chat`, 'center')
// })

// // sending a msg to everyone on submiting message form
// form.addEventListener('submit', (e) => {
//     e.preventDefault()
//     if (msg.value) {
//         append(`You : ${msg.value} `, 'right');
//         socket.emit('send', msg.value);
//         msg.value = '';
//     }
// })