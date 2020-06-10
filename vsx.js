//https://github.com/stormboy/node-pioneer-avr/blob/master/pioneer-avr.js
var util = require('util'),
    net = require('net');

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
                    false:"PO",
                    true:"PF",
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
                    TV:"15FN",
                    PC:"05FN",
                    Vinyl:"01FN",
                    PS3:"06FN",
                    PS4:"20FN",
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
    
    let connect = function() {
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
            connect();
        });
        client.on("close", function() {
            console.log("close");
            connected=false;
            connect();
        });

        client.on("timeout", function() {
            console.log("timeout");
            connected=false;
            connect();
        });
    
        client.on("error", function(err) {
            console.log(err);
            let client = connect();
            connected=false;
            setTimeout(()=> {
                console.log("try reconnect VSX");
                connect();
            },10000);
        });
    };


let recData = function(buffer){
    var data = buffer.toString();
    var length = data.lastIndexOf('\r');
    data = data.substr(0, length);
    data = data.split("\n")
    //console.log(data)

    //process call -> update state, call callbacks
    let hasChanged = data.forEach((e) =>{
        if(e.startsWith("PWR0"&&state.power.state!==true)){
            state.power.state=true;
            callbackFunctions.onPowerOn();
        }
        else if (e.startsWith("PWR1")&&state.power.state!==false){
            state.power.state=false;
            callbackFunctions.onPowerOff();
        }

        else if (e.startsWith("MC")){
            state.mcacc.state=e.substr(2,1)+"MC";
            callbackFunctions.onMCACC();
        }
            
        else if (e.startsWith("VOL")){
            state.volume.state= parseInt(e.substr(3,3));
            callbackFunctions.onVol();
        }
            
        else if (e.startsWith("FN")){
            state.input.state=e.substr(2,2)+"FN";
            callbackFunctions.onChannel();
        }
        else
            return false;

        return true;
    })
}
let reqData = function(){
    client.write("?P\r");
    client.write("?V\r");
    client.write("?F\r");
    client.write("?MC\r");

    //sendData(["5MC","15FN"])
}

let sendData = function(stateChanges){
    console.log(stateChanges)
    if(stateChanges.power!=undefined){
        client.write(stateChanges.power?"PO\r":"PF\r")
        stateChanges.power= undefined;
         return setTimeout(sendData,2000,stateChanges)
    }
    else if(stateChanges.volume!=undefined){
        let volStr = "" + stateChanges.volume;
        if(volStr.length===1)
            volStr = "00" + volStr;
        else if(volStr.length===2)
            volStr = "0" + volStr;

        volStr+="vl"
        client.write(volStr + "\r");
        stateChanges.volume=undefined;
        return sendData(stateChanges)
    }
    else if(stateChanges.input!=undefined){
        client.write(stateChanges.input + "\r");
        stateChanges.input=undefined;
        return sendData(stateChanges)
    }
    else if(stateChanges.mcacc!=undefined){
        client.write(stateChanges.mcacc + "\r");
        stateChanges.mcacc=undefined;
        return sendData(stateChanges)
    }else{
        return;
    }
}



exports.getState = () => {  
    return state;
}

let callbackFunctions = {};
exports.registerCallbacks = (cbFkts) => {  
    callbackFunctions = cbFkts;
}
exports.assureState = (stateChanges) => {  
    console.log("VSX-change state: " + JSON.stringify(stateChanges));
    sendData(stateChanges);
    
}

exports.start = () => {  
    connect();
}
//startConnection
