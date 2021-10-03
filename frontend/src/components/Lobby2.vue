<template>
    <div class="container">
        <h2>Sala Estatus : {{ status }}</h2>
        <div class="numbers">
            <ul class="numbers-list">
                <li v-for="vote in votes" :key="vote"
                :class="{voted: user.vote == vote}"
                @click="emitVote(vote)">{{vote}}</li>
                
            </ul>
        </div>
        <div class="users">
            <h3>Voting issue: {{issue.id}}</h3>
            <p v-if="errorMessage"> {{ message }}</p>

            <ul class="memberList">
                <li v-for="(member, index) in members" :key="index">
                    <div class="rol">{{member.rol}}</div>
                    <div class="nombre">{{member.name}}</div>
                    <div class="voto">{{member.vote ? member.vote : "-"}}</div>
                </li>
            </ul>


        </div>
        
    </div>
</template>

<script>

import io from 'socket.io-client'

export default {
    name: "Lobby2",
    data() {
    return {
      issue: null,
      votes: [1,2,3,5,8,13,20,40,'?'],
      members: [],
      socket: null,
      user: null,
      status: null,
      errorMessage: false,
      message: ""
    };
  },
  async created() {
    this.issue = this.$route.params

    this.socket = io("http://localhost:8082");

    this.user = JSON.parse(sessionStorage.getItem("user"));


    this.socket.emit("client:room", this.$route.params, this.user);
    
    let id = this.$route.params.id;
    let issueObject = await fetch(`http://localhost:8082/issue/${id}`, {
      headers : {
        token : this.user.token
      }
    });
    issueObject = await issueObject.json();

    if (issueObject.status > 299) {
      
      console.log(issueObject)

      this.errorMessage = true;
      this.message = "Ha ocurrido un error, vuelva a conectarse";
     
      
    } else {

      this.members = issueObject.data.members;

      this.status = issueObject.data.status;

      this.user.name = this.user.name + " (you)";

      this.members.pop();

      this.members.unshift(this.user);

    }
    
  },
  async mounted() {

    this.socket.on("server:issue", (data) => {
      console.log("Hola esta es la data de server:issue");
      console.log(data)
      this.members.push(data.members[data.members.length - 1]);
    });

    this.socket.on("server:issueStatus", (data) => {
      this.status = data;
      this.errorMessage = false
      console.log(this.status);

    })

    this.socket.on("server:issueVote", (data) => {
      let i = 0;
      data.forEach(member => {
        if(member.vote != false && member.rol != "scrumMaster"){
          i++
          console.log(i)
        }
      });

      if(i === data.length - 1){

        data.forEach(member => {
          let player = this.members.findIndex(user => user.id == member.id);

          this.members[player].vote = member.vote
        })
          
        console.log(data);
      }

    })

    this.socket.on("server:restarIssue", (data) => {
  
        data.forEach(member => {
          let player = this.members.findIndex(user => user.id == member.id);

          this.members[player].vote = member.vote
        })

    })

    this.socket.on("client:disconnect", () => {
      this.socket.disconnect();

      this.$router.push({name: 'Home'});
    })

    this.socket.on("server:exitUser", (data) => {

      let index = this.members.findIndex(member => member.id == data);

      this.members.splice(index,1);


    })


  },
  methods: {
    async emitVote(vote) {

      console.log(vote);

      let id = this.$route.params.id;

      if (this.status == "voting") {
        try {
        
          if (this.user.vote != false) {

            this.errorMessage = true;
            this.message = "Ya votaste una vez, imposible cambiar el valor"
            
            return;
          }
          this.user.vote = vote;

        
          let objecto = {
            rol : this.user.rol,
            user: this.user,
            
          }

          let response = await fetch(`http://localhost:8082/issue/${id}/vote`, {
            method: "POST",
            headers: {
              token : this.user.token,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body : JSON.stringify(objecto)
          })

          response = await response.json();

          if(response.status > 299) {

            console.log(response)

            this.errorMessage = true;
            this.message = "Ha ocurrido un error al realizar el voto";

            return

          }else {
            this.errorMessage = false;
          }

          
          
        } catch (error) {
          console.log(error)
        }

        
      } else {

        this.errorMessage = true;
        this.message = "Votación disponible cuando la sala cambie su estatus"
        console.log('El estado de la sala no es "voting", todavia no se puede votar')
        
      }

     
    },
    
  }
}
</script>



<style scoped>

div.container {
    max-width: 550px;
    margin: auto;
}

div.numbers {
    text-align: center;
}


ul.numbers-list {
    display: flex;
    list-style: none;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 0;
}

ul.numbers-list li {
    box-sizing: border-box;
    height: 100px;
    width: 100px;
    margin: 10px;
    padding: 30px;
    background: #16171d;
    font-size: 30px;
    border-radius: 10px;
    color: #ffff;
}


ul.numbers-list {
    list-style: none;
}

ul.numbers-list li.voted {
  background: #9ba0b3;
}

ul.memberList li {
    display: flex;
    align-content: center;
    background: #16171d;
    padding: 16px;
    margin: 10px 0;

}

ul.memberList li div {
    width: 50%;
    display: block;
    margin: auto;
    color: #ffff;
}


</style>