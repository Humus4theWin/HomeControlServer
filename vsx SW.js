//https://github.com/stormboy/node-pioneer-avr/blob/master/pioneer-avr.js
var util = require('util'),
    net = require('net');
    const axios = require("axios");

let connected,
    client;

    var options = {
        port: 23,
        host: "192.168.188.108",
    };

    var state = {
            power:{
                type:"selectMap",
                values:{
                    An:"PO",
                    Aus:"PF",
                },
                state: undefined
            },
            volume:{
                type:"range",
                values:[000,185],
                state:undefined
            },
            input:{
                type:"selectMap",
                values:{
                    Chromecast:"04FN",
                    Lenovo:"25FN",
                    TV:"05FN",
                    PC:"15FN",
                    Vinyl:"01FN",
                    PS4:"06FN",
                    PS3:"20FN",
                },
                state:undefined
            },
            mcacc:{
                type:"selectMap",
                values:{
                    PC:"5MC",
                    Bett:"6MC"
                },
                state:undefined
            }
    }
    
    let connect = function(options) {
        var self = this;
        client = net.connect(options);
    
        client.on("connect", function(socket) {
            console.log("connected");
            connected=true;
            setTimeout(reqData, 200);
        });
    
        client.on("data", function(data) {
            recData(data);
        });
    
        client.on("end", function() {
            console.log("disconnected");
            connected=false;
            let client = connect(options);
        });
    
        client.on("error", function(err) {
            console.log( err);
            let client = connect(options);
        });
    
        return client;
    };

    let SWURL =  "http://192.168.188.116/api/kYibW7kfMgNcVO8aOVU6-WhgDvk1JR7bWnwuagdb/lights/30/state"

let recData = function(buffer){
    var data = buffer.toString();
    var length = data.lastIndexOf('\r');
    data = data.substr(0, length);
    data = data.split("\n")
    console.log(data)

    //process data
    let hasChanged = data.map((e) =>{
        if(e.startsWith("PWR0")){
            state.power.state="PO"
            axios.put(SWURL, {"on":true});
        }
            
        else if (e.startsWith("PWR1")){
            axios.put(SWURL, {"on":false});
            state.power.state="PF"
        }
            
        
        else if (e.startsWith("MC"))
            state.mcacc.state=e.substr(2,1)+"MC"
        
        else if (e.startsWith("VOL"))
            state.volume.state= parseInt(e.substr(3,3))
        
        else if (e.startsWith("FN"))
            state.input.state=e.substr(2,2)+"FN"
        else
            return false;

        return true;
    }).find(e => e)!==undefined;


    //data changed?
    if(hasChanged&&callbackFunction!==undefined){
        callbackFunction(state)
    }
}
let reqData = function(){
    client.write("?P\r");
    client.write("?V\r");
    client.write("?F\r");
    client.write("?MC\r");

    //sendData(["5MC","15FN"])
}

let sendData = function(commandArr){
    if(commandArr.length===0) return;

    console.log(commandArr)
    if(commandArr[0]!=="PF"&&state.power.state!=="PO"){
        client.write("PO\r")
        if(commandArr[0]==="PO")
            commandArr.splice(0,1)
        setTimeout(sendData,1000,commandArr)
        setTimeout(reqData,2000)
    }else{
        client.write(commandArr[0]+"\r");
        commandArr.splice(0,1)
        sendData(commandArr)
    }
}

let callbackFunction;
exports.connect = () => {  
    connect(options);
}
exports.registerCallback = (fkt) => {  
    callbackFunction = fkt;
}
exports.send = (commandArr) => {  
    sendData(commandArr);
}
connect(options);