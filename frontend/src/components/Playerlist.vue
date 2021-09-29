<template>
    <div id="Playerlist">
        <el-container>
            <el-main>
                <el-row>
                    <el-col :span="4"><div class="grid-content"></div></el-col>
                    <el-col :span="16">
                        <el-table
                        :data="tableData"
                        height="300"
                        style="width: 100%">
                        <el-table-column
                        prop="id"
                        label="Fecha"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        label="Nombre"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="rol"
                        label="Dirección">
                        </el-table-column>
                        <el-table-column
                        prop="vote"
                        label="Voto">
                        </el-table-column>
                    </el-table>
                    <el-button size="medium" @click="submit">Cerrar sala e inicar votos</el-button>
                    <el-button size="medium" @click="removeRoom">Eliminar sala y volver a la pagina principal</el-button>
                    <el-button size="medium" @click="restarRoom">Restar Votos</el-button>

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
        user: null
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

      this.tableData = issueObject.data.members;

    },
    async mounted() {
      this.socket.on("server:issue", (data) => {
        console.log("Hola esta es la data de server:issue");
        console.log(data)
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
      async submit() {

        let id = this.$route.params.id;
        //let data = JSON.parse(sessionStorage.getItem("user"));


        let objecto = {
          status : "voting",
          rol : this.user.rol
        }

        let issueObject = await fetch(`http://localhost:8082/issue/${id}/vote`, {
          method: "POST",
          headers: {
            token : this.user.token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body : JSON.stringify(objecto)
        })
        issueObject = await issueObject.json();
        this.status = issueObject.data.status;
        console.log(issueObject);
        console.log(this.status);

      },
      async removeRoom() {
        let id = this.$route.params.id;
        let data = this.user;

        
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

        if(response.data == "ok"){

          this.socket.disconnect();

          console.log(response);

          this.$router.push({name: 'Home'});

        }
      },
      async restarRoom() {
        let id = this.$route.params.id;
        let data = this.user

        
        let response = await fetch(`http://localhost:8082/issue/${id}/restar`, {
          method: "PUT",
          headers: {
            token : this.user.token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body : JSON.stringify(data)
        })
        response = await response.json();

        console.log(response);

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