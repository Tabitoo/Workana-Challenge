<template>
    <div id="Playerlist">
        <el-container>
            <el-main>
                <h2>Sala Estatus : {{ status }}</h2>
                <el-row>
                    <h2 v-if="errorMessage"> {{ message }}</h2>
                    <el-col :span="4"><div class="grid-content"></div></el-col>
                    <el-col :span="16">
                        <el-table
                        :data="tableData"
                        height="300"
                        style="width: 100%">
                        <el-table-column
                        prop="id"
                        label="Id"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        label="Nombre"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="rol"
                        label="Rol">
                        </el-table-column>
                        <el-table-column
                        prop="vote"
                        label="Voto">
                        </el-table-column>
                    </el-table>
                    <el-button size="medium" @click="submit">{{ buttonText }}</el-button>
                    <el-button size="medium" @click="removeRoom">Eliminar sala</el-button>
                    <el-button size="medium" @click="restartRoom">Reiniciar Votos</el-button>

                    </el-col>
                    <el-col :span="4"><div class="grid-content"></div></el-col>
                </el-row>

            </el-main>
        </el-container>

    </div>

  
</template>

<script>

import io from 'socket.io-client'


export default {
    name: 'Playerlist',
    data () {
        return {
        tableData: [],
        socket : null,
        status: null,
        user: null,
        errorMessage: false,
        message: "",
        buttonText : "Cerrar sala e inicar votos"
        }
    },
    async created() {

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

      if(issueObject.status > 299){

        console.log(issueObject)

        this.errorMessage = true;
        this.message = "Ha ocurrido un error, vuelva a conectarse";

      } else {

        this.status = issueObject.data.status;

        this.tableData = issueObject.data.members;


      }

    },
    async mounted() {
      this.socket.on("server:issue", (data) => {
        
        this.tableData.push(data.members[data.members.length - 1]);
      });

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
            let player = this.tableData.findIndex(user => user.id == member.id);

            this.tableData[player].vote = member.vote
          })
            
          console.log(data);
        }

      })

      this.socket.on("server:restarIssue", (data) => {
  
        data.forEach(member => {
          let player = this.tableData.findIndex(user => user.id == member.id);

          this.tableData[player].vote = member.vote
        })

      })

      this.socket.on("server:exitUser", (data) => {

        let index = this.tableData.findIndex(member => member.id == data);

        this.tableData.splice(index,1);


      })

    },
    methods: {
      //Metodo que cambia el estado de la sala
      async submit() {

        let id = this.$route.params.id;
       
        let objeto = {
          status : "voting",
          idUser : this.user.id
        }

        let issueObject = await fetch(`http://localhost:8082/issue/${id}/vote`, {
          method: "POST",
          headers: {
            token : this.user.token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body : JSON.stringify(objeto)
        })
        issueObject = await issueObject.json();

        if(issueObject.status > 299) {

          console.log(issueObject)

          this.errorMessage = true;
          this.message = "Ha ocurrido un error al cambiar el estado de la sala";
          return


        } else {

          this.errorMessage = false;
            
          this.status = issueObject.data.status;
          if(this.status == "voting") {
            this.buttonText = "Abrir Sala"
          } else {
            this.buttonText = "Cerrar sala e inicar votos"
          }
          console.log(issueObject);
          console.log(this.status);

        }



      },
      //Metodo que elimina la sala
      async removeRoom() {

        let id = this.$route.params.id;
        let data = {
          idUser : this.user.id
        };

        
        let response = await fetch(`http://localhost:8082/issue/${id}/delete`, {
          method: "DELETE",
          headers: {
            token : this.user.token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body : JSON.stringify(data)
        })
        response = await response.json();



        if(response.status > 299){
          console.log(response)

          this.errorMessage = true;
          this.message = "Ha ocurrido un error al eliminar la sala";
          return

        } else {
          
          this.socket.disconnect();

         

          this.$router.push({name: 'Home'});

        }
      },
      //reinicia los votos de los usuarios
      async restartRoom() {
        let id = this.$route.params.id;
        let data = {
          idUser : this.user.id
          }

        
        let response = await fetch(`http://localhost:8082/issue/${id}/restart`, {
          method: "PUT",
          headers: {
            token : this.user.token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body : JSON.stringify(data)
        })
        response = await response.json();

        if(response.status > 299){
          console.log(response)

          this.errorMessage = true;
          this.message = "Ha ocurrido un error al reiniciar la sala";
          return

        } else {

          this.errorMessage = false;
         
        }

      }
    }

}
</script>

<style>


h1,h2 {
    font-family: 'IBM Plex Sans', sans-serif;
    color: #fff
}

.el-button {
    margin-top: 20px;
}

.grid-content {
    min-height: 1px;
}

</style>