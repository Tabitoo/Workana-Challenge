const Redis = require("ioredis");
const { Socket } = require("socket.io");
const redis = new Redis(6379, "172.17.0.1");
const jwt = require("jsonwebtoken");
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
                            {name : body.name, rol : body.rol, status : "joining", id: 1, vote: false}
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

                    issueObject.members.push({name : body.name, rol : body.rol, status : "joining", id: issueObject.members.length + 1, vote: false});

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
        //let issue = req.params.id;

        let getId = async (id) => {

            try {

                

                let issueObject = await redis.get("issue:" + id);
                
                issueObject = JSON.parse(issueObject);

                if(getSocket()){
                    
                    console.log("evento desde client:issue")
                    getIo().emit("server:msg","esto es un mensaje, que ande porfavor!!");
                    getSocket().on("client:mensaje", (data) => console.log(data))
                    getIo().to(Number(id)).emit("server:issue", issueObject);
                    
                }

                return res.status(200).json({
                    data : issueObject
                })
            } catch (error) {
                console.log(error)
            }
            
        }

        getId(req.params.id);
    },
    issuePrueba: (req,res) => {
        return res.json({
            data : "hola buenas esto es una prueba"
        })
    },
    issueVote : (req,res) => {

        let id = req.params.issue;
        let body = req.body;

        console.log(id)

        let issueStatus = async (id,body) => {

            try {

                let issueObject = await redis.get(`issue:${id}`);
                issueObject = JSON.parse(issueObject);

                if(body.rol === "scrumMaster") {
                        
                    issueObject.status = body.status;

                    await redis.set(`issue:${id}`, JSON.stringify(issueObject));

                    if(getSocket()) {

                        getIo().to(Number(id)).emit("server:issueStatus", issueObject.status);

                    }

                } else {
                    let user = body.user;

                    let index = issueObject.members.findIndex(usuario => usuario.id == user.id);

                    issueObject.members[index] = user;

                    await redis.set(`issue:${id}`, JSON.stringify(issueObject));

                    if(getSocket()) {

                        getIo().to(Number(id)).emit("server:issueVote", issueObject.members);

                    }


                }
                    

                return res.status(200).json({
                    status : 200,
                    data : issueObject
                })
                
            } catch (error) {
                console.log(error);
            }

        }

        issueStatus(id,body);
       

    }
} 
