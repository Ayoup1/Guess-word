<template>
    <div class="footer">
        <el-row>
            <el-button round>{{activeUsers}}:User playing </el-button><el-button type="warning" round>{{availbleGames}} :Game availble </el-button> 
        </el-row>
    </div>
</template>
<script>
import { mapMutations} from 'vuex'
export default {
  props: {
    msg: String
  },
  data() {
      return {
        activeUsers: 0,
        availbleGames: 0,
      };
  },
  methods: {
    ...mapMutations(['setAvailbleGames']),
  },
  mounted() {
    this.$socket.on('ACTIVE_USERS', data => {
      this.activeUsers = data
    })
    this.$socket.on('AVAILABLE_GAMES', data => {
        this.availbleGames=data
        this.setAvailbleGames(this.availbleGames)
    })
  }
}
</script>
