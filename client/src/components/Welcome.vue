<template>
  <el-row :gutter="20">
    <!-- Main Options -->
    <el-col :span="6" :offset="6">
      <el-button type="primary" :disabled="getAvailbleGames===0"  @click="joinHandler">Join Room</el-button>
    </el-col>
    <el-col :span="6">
      <el-button type="primary " :disabled="getAvailbleGames>0"  plain @click="createHandler">Create Room</el-button>
    </el-col>
    <!-- Start of Dialog -->
    <el-dialog :title="dialog.title" :visible.sync="dialogVisible" width="30%" >
      <!-- Create Game -->
      <template v-if="dialog.create===true">
        <el-row :gutter="20" ><span class="label">Game Name</span><el-input v-model="dialog.input"></el-input></el-row>
        <el-row :gutter="20" ><span class="label">Correct Answer</span><el-input v-model="dialog.correctAnswer"></el-input></el-row>
      </template>
      <el-row :gutter="20"><span class="label">Username</span><el-input v-model="dialog.username"></el-input></el-row>
      <!-- Dialog footer -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleConfirm">Confirm</el-button>
      </span>
    </el-dialog>
    <!-- End Of Dialog -->
  </el-row>
</template>

<script>
import { mapMutations, mapGetters,mapActions } from 'vuex'
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
      return {
        dialogVisible: false,
        dialog:{
          title:'',
          input:'',
          username:'',
          correctAnswer:'',
          create:false
        }
      };
  },
  computed: {
    ...mapGetters(['getGame','getAvailbleGames'])
  },
  methods: {
    ...mapMutations(['setGame','setPlayer']),
    ...mapActions(['initGame','initPlayer']),
    handleConfirm() {
      // console.log(` getGame:: ${this.getGame}`)
      let data
      this.dialogVisible = false
      if(this.dialog.create===false){
        if(this.dialog.username){
          data ={name:this.dialog.username}
          this.$socket.emit('JOIN',data);
        }else{
           this.$message.error('Ouups, username empty.');
        }

      }else{
         if(this.dialog.username && this.dialog.input && this.dialog.correctAnswer){
            this.initGame({correctAnswer:this.dialog.correctAnswer})
            data ={name:this.dialog.username,gameName:this.dialog.input,correctAnswer:this.dialog.correctAnswer}
            this.$socket.emit('CREATE_GAME',data);
         }else{
           this.$message.error('Ouups, empty fields .');
         }
  
      }
      
    },
    joinHandler(){
        this.dialogVisible = true
        this.dialog={ title:'Join Game', username:'',create:false}

    },
    createHandler(){
        this.dialogVisible = true
        this.dialog={ title:'Create Game', input:'', username:'', correctAnswer:'',create:true}
    }
  },

}
</script>

<!--  -->
<style lang="scss">
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .label {
    display: inline-block;
    width: 100%;
    margin: 2px 4px;
    text-align: left;
  }
</style>
