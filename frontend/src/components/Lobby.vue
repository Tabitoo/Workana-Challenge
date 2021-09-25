<template>
  <div id="container">
    <h2>Sala Estatus : {{ status }}</h2>
    <div class="vote">
      <ul id="voteList">
        <li v-for="vote in validVotes"
            :key="vote"
            :class="{voted: you.vote === vote}"
            @click="emitVote(vote)">{{vote}}</li>
      </ul>
    </div>
    <div class="members">
      <h3>
        Voting issue #<input id="issue" type="number" v-model="issue" /> • Connected {{members.length}}
      </h3>
      <h2 v-if="errorMessage"> {{ message }}</h2>
      <ul id="memberList">
        <li :key="index" v-for="(member, index) in members">
          <div class="status">{{member.rol ? '✅' : ''}}</div>
          <div class="name">{{member.name}}</div>
          <div class="vote">{{member.vote ? member.vote : '-'}}</div>
        </li>
      </ul>
    </div>

    <p>🎹 entra aca for instructions at <a href="https://github.com/workana/hiring_challenge">Workana Hiring Challenge</a>.</p>
    <hr />
<pre style="text-align: left;">
        <strong>PHP res:</strong>
        {{responsesDemo.php}}

        <strong>Node res:</strong>
        {{responsesDemo.node}}
</pre>
  
  </div>
   
</template>

<script> 

import io from 'socket.io-client'

export default {
  name: 'Lobby',
  data() {
    return {
      issue: null,
      validVotes: [1,2,3,5,8,13,20,40,'?'],
      members: [
        {name: 'Julian', vote: false},
        {name: 'Flor', vote: false},
        {name: 'Gino', vote: false}
      ],
      responsesDemo: {
        php: null,
        node: null,
      },
      socket: null,
      user: null,
      status: null,
      errorMessage: false,
      message: ""
    };
  },
  computed: {
    you() { return this.members[0] },
  },
  async created() {

    this.issue = this.$route.params

    this.socket = io("http://localhost:8082");

    this.socket.emit("client:room", this.$route.params);
    
    let id = this.$route.params.id;
    let issueObject = await fetch(`http://localhost:8082/issue/${id}`);
    issueObject = await issueObject.json();

    this.members = issueObject.data.members;

    this.status = issueObject.data.status;

    this.user = this.members[this.members.length - 1];

    this.user.name = this.user.name + " (you)";

    this.members.pop();

    this.members.unshift(this.user);

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

    this.demoResponses();
    
  },
  methods: {
    async emitVote(vote) {

      let dataUser = this.user;
      let id = this.$route.params.id;

      if (this.status == "voting") {
        try {
        
          if (this.you.vote != false) {

            this.errorMessage = true;
            this.message = "Ya votaste una vez, imposible cambiar el valor"
            

            return;
          }
          this.you.vote = vote;

        
          let objecto = {
            rol : this.user.rol,
            user: dataUser,
            vote: this.you.vote
          }

          await fetch(`http://localhost:8082/issue/${id}/vote`, {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body : JSON.stringify(objecto)
          })

          
          
        } catch (error) {
          console.log(error)
        }

        
      } else {

        this.errorMessage = true;
        this.message = "Votación disponible cuando la sala cambie su estatus"
        console.log('El estado de la sala no es "voting", todavia no se puede votar')
        
      }

     
    },
    async demoResponses() {
      /*const resPhp = await fetch('http://localhost:8081/issue/232');
      this.responsesDemo.php = JSON.stringify(await resPhp.json());*/
    }
  }
}
</script>


<style scoped>

</style>
