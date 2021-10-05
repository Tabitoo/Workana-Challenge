const socketIo = require('socket.io'); 
const {getRedis} = require("./redis")

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


        //Une el socket del usuario a un room igual al id del issue
        newSocket.on("client:room", async (data, user) => {
            try {
                
                newSocket.join(data.id);
                id = data.id;


                //Almacena el socket del usuario en el array de members con su respectivo indice

                let issueObject = await getRedis().get(`issue:${id}`);
                if (issueObject != null) {

                    issueObject = JSON.parse(issueObject);

                    
                    let index = issueObject.members.findIndex(member => member.id == user.id);

                    issueObject.members[index]["socket"] = newSocket.id;

                    let response = await getRedis().set(`issue:${id}`, JSON.stringify(issueObject));

                    if(response != "OK"){

                        console.log("error al almacenar issue:", response);

                    }

                    console.log("------");
                    console.log("socket conectado a estos rooms desde sockets.js:", socket.rooms);
                    console.log("------");
                    

                    io.to(data.id).emit("server:msg", `mensaje desde el room:${data.id}`);
                    
                
                }
                
            } catch (error) {
                console.log(error);
            }
            
        })

        newSocket.on("disconnecting", async (reason) => {

            if(reason === "transport close"){
                //Cuando un usuario pierde la conexion es eliminado del array members
                //y se emite un evento actualizando la lista de jugadores para los demas usuarios
                try {
                        
                    for (const room of newSocket.rooms) {
                        if (room != newSocket.id) {

                            let issueObject = await getRedis().get(`issue:${room}`);

                            if (issueObject != undefined) {
                                    
                                issueObject = JSON.parse(issueObject);

                                let index = issueObject.members.findIndex(member => member.socket == newSocket.id);

                                let userId = issueObject.members[index].id;

                                issueObject.members.splice(index,1);

                                let vef = await getRedis().set(`issue:${room}`, JSON.stringify(issueObject));

                                if(vef == "OK") {
                                    io.to(room).emit("server:exitUser", userId);
                                } else {
                                    console.log("Error al almacenar el issue:", vef);
                                } 
                            }
                        }
                        
                    }
                    
                } catch (error) {

                    console.log(error);
                    
                }
            }

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