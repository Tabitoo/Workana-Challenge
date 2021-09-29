const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const {getRedis} = require('../redis');

module.exports = async (req,res,next) => {
    
    const token = req.headers['token'];
    
    if(!token){

        return res.json({
            status : 400,
            msg : "token no enviado"
        })

    }

    try {

        const verifyToken = jwt.verify(token,"MySecret");

        let issueObject = await getRedis().get(`issue:${req.params.issue}`);
        issueObject = await JSON.parse(issueObject)

        let user = issueObject.members.find(member => member.id == verifyToken.id);

        if(user != undefined){
            next();
        }else {
            return res.json({
                status : "error",
                data : "Usario no encontrado"
            })
        }
    } catch (error) {
        console.log(error);
        if(!error.expiredAt){
            return res.json({
                meta : {
                    status : 401,
                    msg : "Token invalido"
                }
            })
        }
        res.status(400).json({
            meta : {
                status : 401,
                msg : "Token expirado"
            }
        })
    }
}