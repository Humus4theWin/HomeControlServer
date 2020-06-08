const WebSocket = require('ws');
const axios = require('axios')
const ws = new WebSocket('ws://192.168.188.41:7681/');

let status = {
   
}
 
ws.on('open', function open() {
    console.log("open");
  //ws.send('something');
});
 
ws.on('message', function incoming(data) {
  console.log(data);
});

let REST_URL = "http://192.168.188.41:56789/apps"

function sendRemoteKey(code){ // <key code='1056'/>  OR tvstate
    body = "<?xml version='1.0' ?><remote><key code='" + code + "'/></remote>";
    axios.post(REST_URL+"/SmartCenter", body)
}

//sendKey(1037)
startApp("YouTube")
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