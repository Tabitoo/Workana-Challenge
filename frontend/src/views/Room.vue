<template>
  <div class="about">

    <h1>Poker Planning About</h1>
    <playerlist  v-if="rol == 'scrumMaster'"/>
    <lobby  v-else/>
    

    
    
  </div>
</template>

<script>


import Playerlist from "../components/Playerlist.vue"
import Lobby from "../components/Lobby.vue"





export default {
  name: 'Room',
  components: {
    Lobby,
    Playerlist
  },
  data () {
    return {
      rol: "",
      
    }
  },
  created() {

   


    let data = JSON.parse(sessionStorage.getItem('user'));
   

    this.rol = data.rol

  },
 
}
</script>