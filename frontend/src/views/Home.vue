<template>
  <div class="home">
    <h1>Poker Planning</h1>
    <seleccion /> 
  </div>
</template>

<script>
// @ is an alias to /src



import Seleccion from "@/components/Seleccion.vue"





export default {
  name: 'Home',
  components: {
   Seleccion 
  
   
  },
  data () {
    return {
      rol : "votante"
    }
  }
}
</script>

<style>


body {

  
  box-sizing: border-box;
  margin: 0;  
  background:#101014;
  text-align: center;
}
/*

#logo {
  margin: auto;
  height: 35px;
  width: 219px;
  background: url(https://wkncdn.com/newx/assets/build/img/workana-logo-2x.9e13d14c2.png);
  background-repeat: no-repeat;
  background-size: cover;
}
#container {
  max-width: 550px;
  margin: auto;
}

#voteList {
  margin: 10px auto;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  justify-content: space-around;
}
#voteList li {
  box-sizing: border-box;
  cursor: pointer;
  height: 100px;
  width: 100px;
  margin: 0;
  padding: 30px 0;
  border-radius: 9px;
  box-shadow: 2px 2px 2px #000;
  text-shadow: 1px 1px 2px #444;
  background: #e76f51;
  color: #fff;
  margin: 10px;
  font-size: 30px;
  transition: background-color 0.3s ease font-size 0.3s ease;
}
#voteList li.voted {
  font-size: 33px;
  background: #2a9d8f;
}
#memberList {
  list-style: none;
}
#memberList li {
  box-shadow: 2px 2px 2px #444;
  text-shadow: 1px 1px 1px #444;
  background: #e76f51;
  margin: 0.5em 0;
  padding: 1em;
  border-radius: 8px;
  display: flex;
  align-content: center;
}
#memberList li div {
  width: 50%;
  display: block;
  margin: auto;
}
#memberList li div.name {
  color: #FFF;
}
#memberList li div.vote {
  color: #FFF;
  text-shadow: none;
  font-size: 1.5em;
}
#issue {
  color: #2a9d8f;
  width: 75px;
  text-align: center;
}
  */
</style>