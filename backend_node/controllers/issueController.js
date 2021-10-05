require("dotenv").config();
const jwt = require("jsonwebtoken");
const {getSocket,getIo, getRoom} = require('../sockets');
const {getRedis} = require('../redis');


module.exports = {
    issueJoin : (req,res) => {

        let issue = req.params.issue;
        
        let joining = async (id,body) => {
            try {

                let issueObject = await getRedis().get("issue:" + id);

                let token;
                let user;
                let vef;
                
                if(issueObject == null){

                    user =  {name : body.name, rol : body.rol, status : "joined", id: 1, vote: false}

                    issueObject = {
                        id: id,
                        status : "joining",
                        members : [
                           user
                        ]
                    }

                    vef = await getRedis().set("issue:" + id, JSON.stringify(issueObject));

                    token = jwt.sign({id : issueObject.members[0].id}, process.env.TOKEN_SECRET_WORD, {expiresIn : 60 * 60 * 24});

                    
                }else {

                    issueObject = JSON.parse(issueObject);
                    
                    if(body.rol == "scrumMaster"){
                        
                        if(issueObject.members.find(member => member.rol == "scrumMaster")){
                            return res.status(403).json({
                                status : 403,
                                error : "forbidden",
                                msg : "ya se encuentra un scrum master"
                            })
                        }
                        
                    }

                    if(issueObject.status != "joining") {
                        return res.status(403).json({
                            status : 403,
                            error : "forbidden",
                            msg : "error al unirse a la sala, la votacion ya inicio"
                        })
                    }

                    user = {

                        name : body.name, 
                        rol : body.rol, 
                        status : "joined", 
                        id: issueObject.members.length + 1, 
                        vote: false
                    }

                    issueObject.members.push(user);

                    vef = await getRedis().set("issue:" + id, JSON.stringify(issueObject));

                    let secretKey = process.env.TOKEN_SECRET_WORD

                    //Genera un nuevo token para futuras peticiones
                    token = jwt.sign({id : user.id}, secretKey, {expiresIn : 60 * 60 * 24});


                }

                if (vef != "OK") {
                    console.log("error al almacenar issue:", vef)

                    return res.status(404).json({
                        status : 404,
                        error : "Not Found",
                        msg : "El servidor no pudo encontrar el contenido solicitado"
                    })
                }

                return await res.status(200).json({
                    status : 200,
                    msg : "OK",
                    data : user, 
                    token : token
                });
            } catch (error) {
                console.log(error)
            }

        }

        joining(issue,req.body);
        
    },
    getIssue: (req,res) => {

        

        let getId = async (id) => {

            try {

                let issueObject = await getRedis().get("issue:" + id);

                if( issueObject == null){

                    return res.status(404).json({
                        status : 404,
                        error : "Not Found",
                        msg : "Issue no encontrado"

                    })
                } else {
                    issueObject = JSON.parse(issueObject);

                    if(getSocket()){
                        

                        //Envia el issueObject con el array de members actualizada
                        getIo().to(Number(id)).emit("server:issue", issueObject);
                        
                    }
    
                    return res.status(200).json({
                        status: 200,
                        msg : "OK",
                        data : issueObject
                    })

                }
                
               
            } catch (error) {
                console.log(error)
            }
            
        }

        getId(req.params.issue);
    },
    issueVote : (req,res) => {

        let id = req.params.issue;
        let body = req.body;
        let vef;

        if(!body) {
            return res.status(400).json({
                status : 400,
                error : "Bad Request",
                msg : "Sintaxis invalida"
            })
        }


        console.log(id)

        let issueStatus = async (id,body) => {

            try {

                let issueObject = await getRedis().get(`issue:${id}`);

                if(issueObject == null){

                    
                    return res.status(404).json({
                        status : 404,
                        error : "Not Found",
                        msg : "issue no encontrado"
                    })

                } else {
                    
                    issueObject = JSON.parse(issueObject);
                    let user = issueObject.members.find(member => member.id == body.idUser);

                        
                    if (user == undefined) {
                        console.log("No se encontro el usuario:", user)

                        return res.status(404).json({
                            status : 404,
                            error : "Not Found",
                            msg : "El servidor no pudo encontrar el contenido solicitado"
                        })
                    }

                    if(user.rol === "scrumMaster") {
                        //actualiza el estatus del issueObject
                        switch (true) {
                            case issueObject.status == body.status:
                                issueObject.status = "joining"
                                break;
                        
                            case issueObject.status != body.status:
                                issueObject.status = body.status;
                                break;
                        }

                        vef = await getRedis().set(`issue:${id}`, JSON.stringify(issueObject));

                        if(vef == "OK") {

                            if(getSocket()) {

                                getIo().to(Number(id)).emit("server:issueStatus", issueObject.status);

                            }

                        }


                    } else {

                        //Almacena el voto del usuario en redis

                        
                        let validVotes = [1,2,3,5,8,13,20,40,'?']

                        let index = issueObject.members.findIndex(usuario => usuario.id == user.id);
                        let vote = validVotes.find(voto => voto == body.vote)

                        if(vote == undefined){

                            return res.status(404).json({
                                status : 404,
                                error : "Not Found",
                                msg : "Voto incorrecto"
                            })

                        } else if (issueObject.status != "voting") {
                            return res.status(403).json({
                                status : 403,
                                error : "forbidden",
                                msg : "El status de la sala no es voting"
                            })
                            
                        }



                        issueObject.members[index].vote = body.vote;
                        issueObject.members[index].status = "voted"

                        vef = await getRedis().set(`issue:${id}`, JSON.stringify(issueObject));

                        if(vef == "OK"){
   
                            if(getSocket()) {
                                //Envia el array de members con los votos actualizados
                                getIo().to(Number(id)).emit("server:issueVote", issueObject.members);

                            }

                        }

                    }
                }
                
                if (vef != "OK") {
                    console.log("error al almacenar issue:", vef)

                    return res.status(404).json({
                        status : 404,
                        error : "Not Found",
                        msg : "El servidor no pudo encontrar el contenido solicitado"
                    })
                }

                return res.status(200).json({
                    status : 200,
                    msg : "OK",
                    data : issueObject
                })
                
            } catch (error) {
                console.log(error);
            }

        }

        issueStatus(id,body);

    },
    restartIssue : (req, res) => {

        let issue = req.params.issue;
        let body = req.body;

        if(!body) {
            return res.status(400).json({
                status : 400,
                error : "Bad Request",
                msg : "Sintaxis invalida"
            })
        }

        let restartVote = async (id, body) => {


            let issueObject = await getRedis().get(`issue:${id}`);

            if(issueObject == null){

                return res.status(404).json({
                    status : 404,
                    error : "Not Found",
                    msg : "issue no encontrado"
                })

            } else {

                //Reinicia los votos de los usuarios

                issueObject = JSON.parse(issueObject);

                let scrumMaster = issueObject.members.find(user => user.id == body.idUser);

                if(scrumMaster != undefined && scrumMaster.rol == "scrumMaster"){

                    issueObject.members.forEach(member => {
    
                        member.vote = false;
                        member.status = "joined"
                        
                    });
        
                    let response = await getRedis().set(`issue:${id}`, JSON.stringify(issueObject));
        
                    if(response != "OK") {
    
                        console.log("error al almacenar issue:", vef)
    
                        return res.status(404).json({
                            status : 404,
                            error : "Not Found",
                            msg : "El servidor no pudo encontrar el contenido solicitado"
                        })
                        
                    } 
    
                    //Envia el array de members con los votos reiniciados
                    getIo().to(Number(id)).emit("server:restarIssue", issueObject.members);
    
                    return res.json({
                        status : 200,
                        msg : "OK",
                        data : issueObject
                    })



                }

                return res.status(403).json({
                    status : 403,
                    error : "forbidden",
                    msg : "Solo el scrumMaster puede cambiar la sala"
                })
            }

        }

        restartVote(issue,body);

    },

    deleteIssue: (req,res) => {
        let issue = req.params.issue;
        let body = req.body;

        if(!body) {
            return res.status(400).json({
                status : 400,
                error : "Bad Request",
                msg : "Sintaxis invalida"
            })
        }

        let roomDelete = async (body,issue) => {
            try {
                    
                let issueObject = await getRedis().get(`issue:${issue}`);

                if(issueObject == null){

                    
                    return res.status(404).json({
                        status : 404,
                        error : "Not Found",
                        msg : "issue no encontrado"
                    })
    
                } else {

                        
                    issueObject = JSON.parse(issueObject);

                    let user = issueObject.members.find(user => user.id == body.idUser);

                    if(user != undefined && user.rol == "scrumMaster"){

                        let remove = await getRedis().del(`issue:${issue}`);

                        if(remove != 0){

                            //Evento para desconectar los sockets de los usuarios
                            getIo().to(Number(issue)).emit("client:disconnect");

                            return res.status(200).json({
                                status : 200,
                                data : "ok"
                            })

                        }

                    } else {
                        return res.status(401).json({
                            status : 401,
                            error : "Unauthorized",
                            msg : "Es necesario ser scrumMaster para eliminar la sala"
                        })
                    }

                }

            } catch (error) {

                console.log(error)

            }

        }

        roomDelete(body,issue);
    }
} 
