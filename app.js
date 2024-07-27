const express= require('express');
const app = express();
const http = require('http');
const path = require('path');

const socketio = require("socket.io")

const server = http.createServer(app)
const io = socketio(server);
 
app.set("view engine" , "ejs")
app.use(express.static(path.join(__dirname , "public")))

io.on('connection', (socket) => {
   console.log('connected');

   socket.on('send-location', (data) => {
      io.emit("receive-location",{id:socket.id, ...data})
   });

   socket.on("disconnect",()=>{
      io.emit("user-gone",socket.id)
   })
});

const PORT = 3000;

app.get('/',(req,res)=>{
   res.render("index");
})

server.listen(PORT,()=>{
    console.log(`server is running on https://localhost:${PORT}`);
 });
