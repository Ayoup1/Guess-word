<template>
  <div id="app">
    <router-view class="main"/>
    <Footer/>
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue'
import { mapMutations, mapGetters,mapActions } from 'vuex'
export default {
  components: {
    Footer
  },
    computed: {
    ...mapGetters(['getGame'])
  },
  methods: {
    ...mapMutations(['setGame','setPlayer']),
    ...mapActions(['initGame','initPlayer']),
  },
  mounted() {
    this.$socket.on('updatePlayer', data => {
        this.initPlayer(data)
    }),
    this.$socket.on('updateGame', data => {
        this.setGame(data)
    })
    this.$socket.on('CLOSE', () => {
        this.$router.push('/');

    })
  }
}
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
  list-style: none;
  -webkit-overflow-scrolling: touch;
}

div#app {
  display: flex;
  -webkit-box-orient: vertical;
  flex-direction: column;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
div.main {
  min-height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  margin-bottom: 12px;
  .el-row{
    width: 100%;
  }
  .title{
    display: flex;
    width: 100%;
    height: 150px;
    align-self: flex-start;
    justify-content: center;
  }
    .title{
    display: flex;
    width: 100%;
    height: 150px;
    align-self: flex-start;
    justify-content: center;
  }
  .el-breadcrumb{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 20px;
  }

}
footer {
  flex-shrink: 0;
}

</style>
