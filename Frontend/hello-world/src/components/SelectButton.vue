<template>
  <div class="SelectButton">
    <button onclick="sendCommand("+ type +"," + value")">
      value
    </button>
  </div>
</template>

<script>
export default {
  name: 'SelectButton',
  props: {
    type: String,
    value: String,
    range: Array
  }
}

function sendCommand(type, value){
  let body = { }
  body[type] = value
  Vue.axios.post('http://192.168.188.67:81/vsx',body).then((response) => {
      console.log(response.data)
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
