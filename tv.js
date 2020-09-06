const WebSocket = require('ws');
const axios = require('axios')
let ws;

let state = {
      power:{
          type:"singleKey",
          value: "1012",
          state: undefined
      },
        app:{
            type:"selectMapOrUndefined",
            values:{
                youtube:"YouTube",
                netflix:"Netflix",
                none:"none"
            },
            state: undefined
      },
}
let connect = function() {
  ws = new WebSocket('ws://192.168.188.41:7681/');

  ws.on('open', function open() {
    console.log("TV connected");
  //ws.send('something');
  });
  
  ws.on('message', function incoming(data) {
    console.log(data);
    recData(data)
  });
  //todo get initial state
  setInterval(sendStatusRequest,5000);
}

let sendStatusRequest = function(){
  let body = "<command>tvstate</command>"
  axios.post(REST_URL+"/SmartCenter", body)
}

let recData = function(line){
  if(line.includes("tv_status:0")){
    if(state.power.state===true){
      state.power.state = false;
      callbackFunctions.onPowerOff();
    }
  }
  else if(!state.power.state){
    state.power.state = true;
    callbackFunctions.onPowerOn();
  }
  
  
  if(line.includes("tv_portal_status:1")&&state.app.state!=="YouTube"){
    state.app.state = "YouTube";
    callbackFunctions.onYoutubeOn();
  }
  else if (line.includes("tv_portal_status:0")&&state.app.state==="YouTube"){
    state.app.state = undefined
    callbackFunctions.onYoutubeOff();
  }

  //my be netflix
  if(line.includes("tv_state value='OTHER'")){
    axios.get(REST_URL+"/"+"Netflix").then((res) => {
      if(res.data.toString().includes("<state>running</state>")){
        if(state.app.state !== "Netflix"){
          state.app.state = "Netflix";
          callbackFunctions.onNetflixOn();
          }
        }else if(res.data.toString().includes("<state>stopped</state>"))
        if(state.app.state === "Netflix"){
          state.app.state=undefined;
          callbackFunctions.onNetflixOff();
  
        }
      })    
  }
}

let REST_URL = "http://192.168.188.41:56789/apps"

function sendRemoteKey(code){ // <key code='1056'/>  OR tvstate
    body = "<?xml version='1.0' ?><remote><key code='" + code + "'/></remote>";
    axios.post(REST_URL+"/SmartCenter", body)
}

function startApp(appName){ 
    if(appName!=="YouTube"&&appName!=="Netflix") return;
    let otherApp = (appName==="YouTube")?"YouTube":"Netflix";

    //check other app active
    axios.get(REST_URL+"/"+otherApp).then((res) => {
        if(res.data.toString().includes("<state>running</state>")){
            sendRemoteKey(1037)
            setTimeout(function(){axios.post(REST_URL+"/"+appName)},3000)
        }else
            axios.post(REST_URL+"/"+appName)
      })
}

exports.getState = () => {  
  return state;
}

let callbackFunctions = {};
exports.registerCallbacks = (cbFkts) => {  
  callbackFunctions = cbFkts;
}
exports.assureState = (stateChanges) => {  
  console.log("TV-change state: " + JSON.stringify(stateChanges));
  
  if(stateChanges.power !== undefined){
    if(stateChanges.power!==state.power.state)
      sendRemoteKey("1012")
  }
  if(stateChanges.app==="YouTube"||stateChanges.app==="Netflix"){
    startApp(stateChanges.app)
  }else if(stateChanges.app==="none"){
    if(state.app.state==="YouTube")
      sendRemoteKey("1037");
    else if(state.app.state==="Netflix"){
      sendRemoteKey("1037");
      setTimeout(sendRemoteKey,1000,"1022")
      setTimeout(sendRemoteKey,1200,"1053")
    }
  }
}

exports.start = () => {  
    connect();
}