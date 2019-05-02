<template>
  <div class="home">
    <h1 class="title">Guess The Word Game  </h1>
    <Welcome/>
  </div>
</template>

<script>
import Welcome from '@/components/Welcome.vue'

export default {
  name: 'home',
  components: {
    Welcome
  }
}
</script>
