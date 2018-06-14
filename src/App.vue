<template>
  <div id="app">
    <Map />
    <Home id="home"/>
  </div>
</template>

<script>
import Home from './components/Home.vue'
import Map from './components/Map.vue'

export default {
  name: 'app',
  components: {
    Home,
    Map
  }
}
</script>

<style>
#home {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 300px;
}
</style>
