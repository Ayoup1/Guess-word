import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    player:{
      name:null,
      owner:null
    },
    game: {
      question: {
        id: null,
        question: null
      },
      correctAnswer: null,
      waitingAnswer: false,
      timer: 10,
      rounds: null,
      round: null,
      questions: [],
      gameId: null
    },
    availbleGames:0,
  },
  getters: {
    getPlayer: state => state.player,
    getGame: state => state.game,
    getAvailbleGames: state => state.availbleGames,
  },
  mutations: {
    setPlayer: (state, data) => { state.player = data },
    setGame: (state, data) => { state.game = data },
    setAvailbleGames: (state, data) => { state.availbleGames = data },
  },
  actions: {
    initGame  ({ state }, context) {
      state.game.correctAnswer=context.correctAnswer
    
    },
    initPlayer({ state }, context) {
      state.player.name=context.userName
      state.player.owner=context.owner
      if(context.winner!=null || typeof context.winner !== 'undefined')state.player.winner=context.winner
      if(router.currentRoute.name!='Game'){
        router.push('/game');
      }
      
    } 
  }
})
