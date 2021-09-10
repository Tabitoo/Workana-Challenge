const Redis = require("ioredis");
const redis = new Redis(6379, "172.17.0.1")
const {getSocket,getIo, getRoom} = require('../sockets');

module.exports = {
    issueJoin : (req,res) => {

        let issue = req.params.issue;
        
        let coso = async (id,body) => {
            try {

              
                //let sets = await redis.sadd("issueID", id);

                let issueObject = await redis.get("issue:" + id);
       
                if(issueObject == null){

                    issueObject = {
                        id: id,
                        status : "joining",
                        members : [
                            {name : body.name, rol : body.rol}
                        ]
                    }

                    await redis.set("issue:" + id, JSON.stringify(issueObject));

                    return await res.status(200).json({data : issueObject});
                    
                }else {

                    issueObject = JSON.parse(issueObject);
                    
                    if(body.rol == "scrumMaster"){
                        
                        if(issueObject.members.find(member => member.rol == "scrumMaster")){
                            return res.json({data : "ya se encuentra un scrum master"})
                        }
                        
                    }

                    issueObject.members.push({name : body.name, rol : body.rol, status : "joining"});

                    await redis.set("issue:" + id, JSON.stringify(issueObject));

                    return res.json({data : issueObject});

                }
            } catch (error) {
                console.log(error)
            }

        }

        coso(issue,req.body);
        
    },
    getIssue: (req,res) => {
        let issue = req.params.id;

        let getId = async (id) => {

            try {
                
                let emitplease;

                let issueObject = await redis.get("issue:" + id);
                
                issueObject = JSON.parse(issueObject);



                


               /* if(getRoom() != null) {



                   // getIo().to(id).emit("server:msg2", "hola buenas");


                    //let emisor = emitRoom(id);

                    //emisor.emit("server:issue", issueObject);
 
                    //console.log(getIo());
                    console.log("Rooms?:");
                    console.log(getSocket().rooms);
                    //emitplease = getIo();


                }*/
                
                /*
                if(getSocket()) {

                    //No esta enviando los eventos desde aca.
                    //Mañana recibar como se exporta la variable io,
                    //asignala de vuelta cuando se genera la conexion del socket
                    
                    //emitRoom(id, issueObject);

                    /*getIo().to(id).emit("server:issue", issueObject);
                    console.log(getIo());
                    console.log("Rooms?:");
                    console.log(getSocket().rooms);
                    emitplease = getIo();

                    emitplease.to(id).emit(issueObject);

                }*/

                /*
                if (getRoom()) {
                    console.log("------")
                    console.log("socket conectado a estos rooms desde issueController:", getSocket().rooms);
                    console.log("En teoria esta pasando dos veces por el evento client:room")
                    console.log("------")
                    //getRoom().emit("server:list", issueObject, id);

                }
                */
                return res.status(200).json({
                    data : issueObject
                })
            } catch (error) {
                console.log(error)
            }
            
        }

        getId(issue);
    },
    issuePrueba: (req,res) => {
        return res.json({
            data : "hola buenas esto es una prueba"
        })
    },
    issueVoting : (req,res) => {

    }
} 

