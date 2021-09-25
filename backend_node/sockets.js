const socketIo = require('socket.io'); 

let socket;
let ioSocket;
let room;
let id

const connect = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: true,
            methods: ["GET", "POST"]
        }
    });

    ioSocket = io;

    io.on('connection', (newSocket) => {
        socket = newSocket;
        
        console.log("New socket connected: ", socket.id);


        newSocket.on("client:vote", (data) => {
            console.log("rooms:", newSocket.rooms)
            console.log(data)
        })

        newSocket.on("client:room", (data) => {
            
            newSocket.join(data.id);
            id = data.id;
            
            console.log("------");
            console.log("socket conectado a estos rooms desde sockets.js:", socket.rooms);
            console.log("------");
             
            //room = io.to(data.id);
            

            io.to(data.id).emit("server:msg", `mensaje desde el room:${data.id}`);

        })

        

        newSocket.on("disconnect", () => {

            console.log("socket desconectado");
            console.log("rooms:", newSocket.rooms.size);

        })

    })


}

const getSocket = () => socket;
const getIo = () =>  ioSocket;
const getRoom = () => room;


module.exports = {
    
    connect,
    getSocket,
    getIo,
    getRoom
   
}