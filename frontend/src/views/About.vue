<template>
  <div class="about">

    <h1>Poker Planning About</h1>
    <lobby />
    <!---<playerlist v-if="rol == 'scrumMaster'"/> -->

    
    
  </div>
</template>

<script>

import Lobby from "../components/Lobby.vue"
//import Playerlist from "../components/Playerlist.vue"

export default {
  name: 'About',
  components: {
    Lobby
  },
  data () {
    return {
      rol: "",
    }
  },
  created() {

    
    
  },
 
}
</script>