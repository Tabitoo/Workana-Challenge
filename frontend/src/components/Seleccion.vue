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
                        <form action="" class="formulario">
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

                            <el-button size="medium" @click="onSubmit">Enviar</el-button>
                            
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
            rol: ''
            }
    },
    methods: {
        handleChange(value) {
            console.log(value)
        },
        async onSubmit() {
            try {
                    
                console.log("Se activo el submit")
                let objeto = {
                    rol : this.rol,
                    name: this.input,
                    sala: this.num
                }
                console.log(objeto)
                let response = await fetch(`http://localhost:8082/issue/${this.num}/join`, {
                    method: 'POST',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(objeto)
                })

                response = await response.json();

                console.log(response.data.members)
                
                let user = response.data.members[response.data.members.length - 1];

                console.log(user);

                sessionStorage.setItem(`user`,  JSON.stringify(user));

                this.$router.push({name: 'About', params : {id : this.num}});
                
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

.formulario el-select {
    padding: 20px;
}

.el-row {
    margin-bottom: 20px;
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

</style>