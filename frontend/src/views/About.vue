<template>
  <div class="about">

    <h1>Poker Planning About</h1>
    <playerlist  v-if="rol == 'scrumMaster'"/>
    <lobby2  v-else/>
    

    
    
  </div>
</template>

<script>

//import Lobby from "../components/Lobby.vue"
import Playerlist from "../components/Playerlist.vue"
import Lobby2 from "../components/Lobby2.vue"

//import io from 'socket.io-client'



export default {
  name: 'About',
  components: {
    Lobby2,
    Playerlist
  },
  data () {
    return {
      rol: "",
      
    }
  },
  created() {

    //this.socket = io("http://localhost:8082");


    let data = JSON.parse(sessionStorage.getItem('user'));
    console.log("data de sessionStorage: ")
    console.log(data);

    this.rol = data.rol

  },
 
}
</script>