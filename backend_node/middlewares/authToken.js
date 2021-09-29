const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const {getRedis} = require('../redis');

module.exports = async (req,res,next) => {
    
    const token = req.headers['token'];
    
    if(!token){

        return res.json({
            status : 400,
            error : "Bad Request",
            msg : "token no enviado"
        })

    }

    try {

        const verifyToken = jwt.verify(token,"MySecret");

        let issueObject = await getRedis().get(`issue:${req.params.issue}`);

        if(issueObject == null) {

            return res.status(404).json({
                status : 404,
                error : "Not Found",
                msg : "issue no encontrado"
            })

        } else {

            issueObject = await JSON.parse(issueObject)


            let user = issueObject.members.find(member => member.id == verifyToken.id);
    
            if(user != undefined){
                next();
            }else {
                return res.status(404).json({
                    status : 404,
                    error : "Not Found",
                    msg : "Usario no encontrado"
                })
            }

        }
        

      
    } catch (error) {
        console.log(error);
        if(!error.expiredAt){
            return res.json({
                meta : {
                    status : 400,
                    error : "Bad Request",
                    msg : "Token invalido"
                }
            })
        }
        res.status(400).json({
            meta : {
                status : 401,
                error : "Unauthorized",
                msg : "Token expirado"
            }
        })
    }
}