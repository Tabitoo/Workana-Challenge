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
                        prop="date"
                        label="Fecha"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        label="Nombre"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="address"
                        label="Dirección">
                        </el-table-column>
                        <el-table-column
                        prop="address"
                        label="Voto">
                        </el-table-column>
                    </el-table>
                    <el-button size="medium">Cerrar sala e inicar votos</el-button>

                    </el-col>
                    <el-col :span="4"><div class="grid-content"></div></el-col>
                </el-row>

            </el-main>
        </el-container>

    </div>

  
</template>

<script>
export default {
    name: 'Playerlist',
    data () {
        return {
        tableData: [{
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }, {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }, {
          date: '2016-05-04',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }, {
          date: '2016-05-01',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }, {
          date: '2016-05-08',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }, {
          date: '2016-05-06',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }, {
          date: '2016-05-07',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }],
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