<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item >{{getGame.name}}</el-breadcrumb-item>
            <el-breadcrumb-item>User : <el-tag>{{getPlayer.name}}</el-tag></el-breadcrumb-item>
        </el-breadcrumb>
        <el-row :gutter="20">
            <!-- Game info -->
            <el-col :span="4" v-if="!getGame.endGame">
                <span class="label">Word to guess :</span>
                <!-- Guesser -->
                <template v-if="getPlayer.owner===false">
                    <div class="column">
                        <el-input  placeholder="Entrez quelque chose" v-model="player.answer" @keyup.enter.native="guessHandler"></el-input>
                        <el-button type="primary" round @click.native="guessHandler">Guess</el-button>
                        <el-alert  v-if="game.answer!=null && game.answer===false" title="Answer false" type="error" effect="dark"></el-alert>
                    </div>
                    
                </template>
                <!-- Game creater -->
                <template v-if="getPlayer.owner">
                    <el-tag type="info" v-if="getGame.correctAnswer ">{{getGame.correctAnswer}}</el-tag>
                    <el-tag type="info" v-if="!getGame.correctAnswer">not defined yet</el-tag>
                </template>
            </el-col>
            <!-- Retry -->
            <el-col :span="4" v-else>
                <el-button type="primary" round @click="retryHandler">Retry</el-button>
            </el-col>
            <!-- Game Creater YES/NO -->
            <template v-if="getPlayer.owner">
                <el-col :span="8" :offset="4" v-if="!getGame.endGame">
                    <el-form v-if="getGame.question && getGame.waitingAnswer">
                        <el-form-item>
                            <span class="label">Player 2 Question:</span>
                            <el-alert :title="getGame.question.question" type="info" :closable="false"></el-alert>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="answerHandler(true)" round>Yes</el-button>
                            <el-button @click="answerHandler(false)" round>No</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!-- Guesser player win -->
                <el-col :span="8" :offset="4" v-else>
                    <template v-if="getPlayer.endGame">
                        <el-alert :title="'Congratulation you win !!'" :description="getGame.questions.length+' Question Asked and the guess word is :'+getGame.correctAnswer" type="success" :closable="false" show-icon></el-alert>
                    </template>
                    <template v-else>
                        <el-alert :title="'Other player Win'" :description="getGame.questions.length+' Question Asked'" type="info" :closable="false" show-icon></el-alert>
                    </template>
                </el-col>
                <el-col :span="8" :offset="4" v-if="getGame.hasStarted===false">
                       <el-alert :title="'Please be patient'" :description="'Waiting other player to join'" type="warning" :closable="false" show-icon></el-alert>
                </el-col>
                
            </template>
            <!-- Guesser -->
            <template v-else>
                <el-col :span="8" :offset="4" v-if="!getGame.endGame">
                    <!-- Guesser player waiting for Answer -->
                    <template v-if="getGame.waitingAnswer">
                        <el-alert
                            title="Wait other player answer "
                            type="success"
                            :description="'Q: '+getGame.question.question+' ?'" :closable="false">
                        </el-alert>
                    </template>
                    <!-- Guesser player Ask -->
                    <template v-else>
                        <el-form>
                            <el-form-item>
                                <span class="label">Player {{getGame.round}} Question:</span>
                                <el-input placeholder="Entrez quelque chose" v-model="player.question"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitHandler" round>Submit</el-button>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-col>
                <!--player win -->
                <el-col :span="8" :offset="4" v-else>
                    <template v-if="getPlayer.winner">
                        <el-alert :title="'Congratulation you win !!'" :description="getGame.questions.length+' Question Asked and the guess word is :'+getGame.correctAnswer" type="success" :closable="false" show-icon></el-alert>
                    </template>
                    <template v-else>
                        <el-alert :title="'Other player Win'" :description="getGame.questions.length+' Question Asked'" type="info" :closable="false" show-icon></el-alert>
                    </template>
                </el-col>
            </template>
        </el-row>
        <el-row :gutter="20">
            <!-- Questions length -->
            <el-col :span="4" >
                <span class="label"> Question :</span>
                <el-tag type="warning" >{{getGame.questions.length}}</el-tag>
            </el-col>
            <!-- Questions details -->
            <el-col :span="8" :offset="4">
                <el-card class="box-card" v-if="getGame.questions.length>0">
                        <div v-for="item in getGame.questions" :key="item.id" class="text item">
                            <template v-if="item.answer!=null">
                                {{item.question }} 
                                <el-tag :type="item.answer?'success':'warning'">{{item.answer}}</el-tag> 
                            </template>
                        </div>
                    </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {mapMutations,mapGetters} from 'vuex';
export default {
  name: 'game',
  data(){
      return{
        game: {
            correctAnswer: this.$store.state.game.correctAnswer,
            answer:null
        },
        player:{
            question:'',
            answer: '',
        }
      }
  },
  computed: {
    ...mapGetters(['getGame','getPlayer'])
  },
    beforeRouteEnter (to, from, next) {
      next(vm => {
          if(!vm.getPlayer.name)vm.$router.push('/');
       })
    },
  methods: {
    ...mapMutations(['setGame']),
    guessHandler(){
         this.game.answer=null
        let data ={gameId:this.getGame.gameId,answer:this.player.answer}
        this.$socket.emit('GUESS_ANSWER',data);
    },
    retryHandler(){
        let data ={gameId:this.getGame.gameId}
        this.$socket.emit('RETRY',data);
    },
    answerHandler(answer){
        let data ={gameId:this.getGame.gameId,question:{id:this.getGame.question.id,question:this.getGame.question.question,answer}}
        this.$socket.emit('ANSWER_QUESTION',data);
    },
    submitHandler() {
        let data ={gameId:this.getGame.gameId,question:this.player.question}
        this.$socket.emit('ASK_QUESTION',data);
    }
  },
  mounted() {
    this.$socket.on('ANSWER_FALSE', data => {
        this.game.answer=data
    })
  }

}
</script>
<style lang="scss">
.column > * {
    margin: 8px 0;
}
.box-card{
  .item {
    margin-bottom: 18px;
  }
  .text {
    font-size: 14px;
  }
}

</style>
