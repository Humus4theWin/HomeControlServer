const WebSocket = require('ws');
const axios = require('axios')
let ws;

let REST_URL = "http://192.168.188.41:56789/apps"

let connect = function() {
  try{
    ws = new WebSocket('ws://192.168.188.41:7681/');
  }catch (err){
    console.log("TV connection failed")
    setTimeout(function(){
      console.log("TV try reconnect")
        connect();
    },3000)
  }
  

  ws.on('open', function open() {
    console.log("TV connected");
  });
  
  ws.on('message', function incoming(data) {
    console.log(data);
    recData(data)
  }); 

  ws.on('error', function retry() {
    ws.close();
    try{
      ws.terminate();
    }catch (err){
      console.log("TV no connection")
    }
    setTimeout(function(){
      console.log("TV try reconnect")
        connect();
    },3000)
    
  });

  //todo get initial state
}

let state;

let recData = function(line){
  if(line.includes("tv_portal_status:1")&&state!=="YouTube"){
    state= "YouTube";
    callbackFunctions.onYoutubeOn();
  }
  else if (line.includes("tv_portal_status:0")&&state==="YouTube"){
    state = undefined
  //  callbackFunctions.onYoutubeOff();
  }

  //may be netflix
  if(line.includes("tv_state value='OTHER'")){
    setTimeout(function(){
    axios.get(REST_URL+"/"+"Netflix").then((res) => {
      if(res.data.toString().includes("<state>running</state>")){
        if(state !== "Netflix"){
          state = "Netflix";
          callbackFunctions.onNetflixOn();
          }
        }else if(res.data.toString().includes("<state>stopped</state>"))
        if(state === "Netflix"){
          state=undefined;
        //  callbackFunctions.onNetflixOff();
        }
      })    
    },2000)
    setTimeout(function(){
      axios.get(REST_URL+"/"+"Netflix").then((res) => {
        if(res.data.toString().includes("<state>running</state>")){
          if(state !== "Netflix"){
            state = "Netflix";
            callbackFunctions.onNetflixOn();
            }
          }else if(res.data.toString().includes("<state>stopped</state>"))
          if(state === "Netflix"){
            state=undefined;
          //  callbackFunctions.onNetflixOff();
          }
        })    
      },5000)
  }
}

let callbackFunctions = {};
exports.registerCallbacks = (cbFkts) => {  
  callbackFunctions = cbFkts;
}

exports.start = () => {  
    connect();
}