<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
  //import HelloWorld from './components/HelloWorld.vue'

  import Vue from 'vue'
  import axios from 'axios'
  import VueAxios from 'vue-axios' 
//import SelectButton from './components/SelectButton.vue'
//import ButtonWrapper from './components/ButtonWrapper.vue'
//import RelativeButton from './components/RelativeButton.vue'

Vue.use(VueAxios, axios)



Vue.axios.get('http://192.168.188.67:81/vsx').then((response) => {
  console.log(response.data)
})

export default {
  name: 'App',
  components: {
    //HelloWorld
  }
}

app.component('button-counter', {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; 
}
</style>
