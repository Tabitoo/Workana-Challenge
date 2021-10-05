<template>
    <div id="Seleccion">
        <el-container>
            <el-main>
                <el-row :gutter="20">
                    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
                    <el-col :span="12">
                        <div class="grid-content-1">
                            <article class="title">
                                <h2>Seleccione un rol y unase a una sala</h2>
                            </article>
                            <p v-if="errorMessage" id="errorMessage"> {{ message }}</p>
                            <form action="" class="formulario" >
                                <el-input placeholder="Nombre" v-model="input" size="medium"></el-input>
                                <el-select v-model="rol">
                                    <el-option popper-class="fondo"
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            
                                <el-input-number v-model="num" @change="handleChange" :min="1" popper-class="fondo"></el-input-number>

                                
                                <el-button  @click.prevent="onSubmit">Enviar</el-button>
                                
                            </form>
                        </div>
                    </el-col>
                    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
                </el-row>                
            </el-main>
        </el-container>    
    </div>
  
</template>

<script>
export default {
    name: 'Seleccion',
    data () {
        return {
            input: "",
            num: 1,
            options: [{
            value: 'scrumMaster',
            label: 'Scrum Master'
            }, {
            value: 'votante',
            label: 'Votante'
            }],
            rol: '',
            errorMessage : false,
            message : ""
            }
    },
    methods: {
        handleChange(value) {
            console.log(value)
        },
        async onSubmit() {
            try {
                    
                
                let objeto = {
                    rol : this.rol,
                    name: this.input,
                    sala: this.num
                }

                switch (true) {
                    case objeto.rol == "":
                        
                        this.errorMessage = true;
                        this.message = "campo rol vacio"
                        return;

                    case objeto.name == "":

                        this.errorMessage = true;
                        this.message = "campo nombre vacio"
                        return
                    case Number.isNaN(objeto.sala):
                        this.errorMessage = true;
                        this.message = "Solo se aceptan numeros"
                        return
                        
                    default:
                        break;
                }


                let response = await fetch(`http://localhost:8082/issue/${this.num}/join`, {
                    method: 'POST',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(objeto)
                })

                response = await response.json();

                


                if(response.status > 299){

                    this.errorMessage = true;
                    this.message = response.msg
                    return

                } else {
                        
                    let user = response.data;
                    //Se le asigna el token de jwt al objeto del usuario
                    user["token"] = response.token;

                    sessionStorage.setItem(`user`,  JSON.stringify(user));

                    this.$router.push({name: 'About', params : {id : this.num}});

                }

            } catch (error) {
                console.log(error)
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

.formulario {
    
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-bottom: 20px;
    
}

.el-button {
    margin-top: 0;
}


.formulario el-select {
    padding: 20px;
}


.el-row {
    margin-bottom: 20px;
} 

.el-input--medium {
    margin: 20px;
}

.el-col {
    border-radius: 4px;
}


.grid-content {
    border-radius: 4px;
    min-height: 36px;
}


 
.grid-content-1 {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    flex-direction: column;
    box-sizing: border-box;
    border-radius: 4px;
    min-height: 36px;
    background-color: #16171d;
}

#errorMessage {
    color: #fff;
}

</style>