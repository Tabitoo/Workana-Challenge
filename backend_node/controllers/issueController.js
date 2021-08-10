const Redis = require("ioredis");
const redis = new Redis(6379, "172.17.0.1")

module.exports = {
    issueJoin : (req,res) => {

        let issue = req.params.issue;
        
        let coso = async (id,body) => {
            try {

                let sets = await redis.sadd("issueID", id);
                
                if(sets == 1){

                    let issueObject = {
                        status : "joining",
                        members : [
                            {name : body.name, rol : body.rol}
                        ]
                    }

                    console.log(issueObject)

                    await redis.set("issue:" + id, JSON.stringify(issueObject));

                    return res.json({data : issueObject})
                    
                }else {
            
                    let issueObject = await redis.get("issue:" + id);

                    issueObject = JSON.parse(issueObject);

                    if(body.rol == "scrumMaster"){


                        if(issueObject.members.find(member => member.rol == "scrumMaster")){
                            return res.json({data : "ya se encuentra un scrum master"})
                        }
                        
                    }

                    issueObject.members.push({name : body.name, rol : body.rol, status : "joining"});

                    await redis.set("issue:" + id, JSON.stringify(issueObject));

                    console.log(issueObject);

                    return res.json({data : issueObject});

                }
            } catch (error) {
                console.log(error)
            }

        }

        coso(issue,req.body);
        
    },
    issueVoting : (req,res) => {

    }
} 

