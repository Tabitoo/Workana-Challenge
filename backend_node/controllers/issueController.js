
const jwt = require("jsonwebtoken");
const {getSocket,getIo, getRoom} = require('../sockets');
const {getRedis} = require('../redis')

module.exports = {
    issueJoin : (req,res) => {

        let issue = req.params.issue;
        
        let coso = async (id,body) => {
            try {

                let issueObject = await getRedis().get("issue:" + id);
                let token;
                let user;
                let vef;
                
                if(issueObject == null){

                    user =  {name : body.name, rol : body.rol, status : "joining", id: 1, vote: false}

                    issueObject = {
                        id: id,
                        status : "joining",
                        members : [
                           user
                        ]
                    }

                    vef = await getRedis().set("issue:" + id, JSON.stringify(issueObject));

                    token = jwt.sign({id : issueObject.members[0].id}, "MySecret", {expiresIn : 60 * 60 * 24});

                    //return await res.status(200).json({data : issueObject, token : token});
                    
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
                        status : "joining", 
                        id: issueObject.members.length + 1, 
                        vote: false
                    }

                    issueObject.members.push(user);

                    vef = await getRedis().set("issue:" + id, JSON.stringify(issueObject));

                    token = jwt.sign({id : user.id}, "MySecret", {expiresIn : 60 * 60 * 24});

                    //return res.json({data : issueObject, token : token});

                }

                if (vef != "OK") {
                    console.log("error al almacenar issue:", vef)

                    return res.status(404).json({
                        status : 404,
                        error : "Not Found",
                        msg : "El servidor no pudo encontrar el contenido solicitado"
                    })
                }

                return await res.status(200).json({data : user, token : token});
            } catch (error) {
                console.log(error)
            }

        }

        coso(issue,req.body);
        
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
                        
                        console.log("evento desde client:issue")
                        getIo().emit("server:msg","esto es un mensaje, que ande porfavor!!");
                        getSocket().on("client:mensaje", (data) => console.log(data))
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

                    if(body.rol === "scrumMaster") {
                            
                        issueObject.status = body.status;

                        vef = await getRedis().set(`issue:${id}`, JSON.stringify(issueObject));

                        if(vef == "OK") {
   
                            if(getSocket()) {

                                getIo().to(Number(id)).emit("server:issueStatus", issueObject.status);

                            }

                        }


                    } else {
                        let user = body.user;

                        let index = issueObject.members.findIndex(usuario => usuario.id == user.id);

                        issueObject.members[index] = user;

                        vef = await getRedis().set(`issue:${id}`, JSON.stringify(issueObject));

                        if(vef == "OK"){
   
                            if(getSocket()) {

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
    restarIssue : (req, res) => {

        let issue = req.params.issue;
        let body = req.body;

        if(!body) {
            return res.status(400).json({
                status : 400,
                error : "Bad Request",
                msg : "Sintaxis invalida"
            })
        }

        let restarVote = async (id, body) => {

            console.log(body);

            let issueObject = await getRedis().get(`issue:${id}`);

            if(issueObject == null){

                return res.status(404).json({
                    status : 404,
                    error : "Not Found",
                    msg : "issue no encontrado"
                })

            } else {

                issueObject = JSON.parse(issueObject);

                issueObject.members.forEach(member => {
    
                    member.vote = false;
                    
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

                getIo().to(Number(id)).emit("server:restarIssue", issueObject.members);

                return res.json({
                    status : 200,
                    data : "ok"
                })

            }

        }

        restarVote(issue,body);

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

                    let user = issueObject.members.find(user => user.id == body.id);

                    if(user.rol == "scrumMaster"){

                        let remove = await getRedis().del(`issue:${issue}`);

                        if(remove != 0){

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
