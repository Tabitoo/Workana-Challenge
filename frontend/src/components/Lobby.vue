<template>
  <div id="container">
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
      <ul id="memberList">
        <li :key="index" v-for="(member, index) in members">
          <div class="status">{{member.rol ? '✅' : ''}}</div>
          <div class="name">{{member.name}}</div>
          <div class="vote">{{member.rol ? member.rol : '-'}}</div>
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
      issue: 234,
      validVotes: [1,2,3,5,8,13,20,40,'?'],
      members: [
        {name: 'Julian (you)', vote: false},
        {name: 'Flor', vote: false},
        {name: 'Gino', vote: false}
      ],
      responsesDemo: {
        php: null,
        node: null,
      },
      socket: null
    };
  },
  computed: {
    you() { return this.members[0] },
  },
  async created() {

    this.socket = io("http://localhost:8082");


    this.socket.emit("client:room", this.$route.params);

    
    let id = this.$route.params.id;
    let issueObject = await fetch(`http://localhost:8082/issue/${id}`);
    issueObject = await issueObject.json();

    this.socket.emit("client:issue", issueObject);

    this.members = issueObject.data.members;

    

    
    
  },
  async mounted() {

    this.socket.on("server:issue", (data) => {
      console.log("Hola esta es la data de server:issue");
      console.log(data)
      this.members = data.members
    });

/*
    this.socket.on("server:issue", (data) => {
      
      console.log("Evento posiblemente recibo desde un room");
      console.log("------")
      console.log(data);
      console.log("------")
      this.members = data.members;

    })
  */



    this.socket.on("server:msg", (data) => {
      console.log(data)
    });

    this.socket.on("server:msg2", (data) => {
      console.log(data);
    })

    this.demoResponses();
    
  },
  methods: {
    emitVote(vote) {
    this.socket.emit("client:vote", {vote : vote} )
      if (vote === this.you.vote) {
        this.you.vote = false;
        return;
      }
      this.you.vote = vote;
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
