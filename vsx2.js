//https://github.com/stormboy/node-pioneer-avr/blob/master/pioneer-avr.js
var util = require('util'),
    net = require('net');

let connected,
    client;

var connectionOptions = {
    port: 23,
    host: "192.168.188.108",
};
var stateDescr = {
    power:{
        on:"PO",
        off:"PF",
    },
    volume:[000,185],
    input:{
        Chromecast:"21FN",
        Dock:"25FN",
        BT:"15FN",
        PC:"01FN",
        TV:"05FN",
        PS3:"06FN",
        PS4:"04FN",
        
    },
    mcacc:{
        PC:"5MC",
        Bett:"6MC"
    },
    zone2_power:{
            on:"APO",
            off:"APF"
    }
}

var state = {
    power: undefined,
    volume: undefined,
    input: undefined,
    mcacc: undefined,
    zone2_power: undefined,
}

let connectToService = function() {
    connected = false;
    client = net.connect(connectionOptions);

    client.on("connect", function(socket) {
        console.log("VSX connected");
        connected=true;
        setTimeout(requestData, 200);
    });

    client.on("data", function(data) {
        recData(data);
    });

    client.on("end", function() {
        console.log("VSX disconnected");
        connectToService();
    });
    client.on("close", function() {
        console.log("VSX close");
        connectToService();
    });

    client.on("timeout", function() {
        console.log("VSX timeout");
        connectToService();
    });

    client.on("error", function(err) {
        console.log(err);
        setTimeout(()=> {
            console.log("VSX try reconnect");
            connectToService();
        },10000);
    });
};

let recData = function(buffer){
    var data = buffer.toString();
    var length = data.lastIndexOf('\r');
    data = data.substr(0, length);
    data = data.split("\n")
    console.log(data)
    data.forEach((e) =>{
        if(e.startsWith("PWR0")&&state.power!=="on"){
            state.power="on";
            callbackFunctions.onPowerOn();
        }

        else if (e.startsWith("PWR1")&&state.power!=="off"){
            state.power="off";
            callbackFunctions.onPowerOff();
        }

        else if (e.startsWith("MC")){
            let val = e.substr(2,1)+"MC";
            state.mcacc = getByValue(stateDescr.mcacc, val)
            callbackFunctions.onMCACC();
        }
            
        else if (e.startsWith("VOL")){
            state.volume = parseInt(e.substr(3,3));
            callbackFunctions.onVol();
        }
            
        else if (e.startsWith("FN")){
            let val = e.substr(2,2)+"FN";
            state.input = getByValue(stateDescr.input, val)
            callbackFunctions.onChannel();
        } 
        
        else if (e.startsWith("APR")){
            let val = "AP" + (e.substr(3,1)==1)?'F':'O';
            state.zone2_power = getByValue(stateDescr.input, val)
            callbackFunctions.onChannel();
        }
    })
}

let requestData = function(){
    client.write("?P\r");
    client.write("?V\r");
    client.write("?F\r");
    client.write("?MC\r");
    client.write("?BP\r");
}

let sendData = function(stateChanges){
    console.log(stateChanges)
    if(stateChanges.power!=undefined){
        client.write(stateDescr.power[stateChanges.power]+"\r")
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
        client.write(stateDescr.input[stateChanges.input]+ "\r");
        stateChanges.input=undefined;
        return sendData(stateChanges)
    }
    else if(stateChanges.mcacc!=undefined){
        client.write(stateDescr.mcacc[stateChanges.mcacc]+ "\r");
        stateChanges.mcacc=undefined;
        return sendData(stateChanges)
    }else if(stateChanges.zone2_power!=undefined){
        client.write('76ZV'+ "\r");
        client.write(stateDescr.zone2_power[stateChanges.zone2_power]+ "\r");
        stateChanges.zone2_power=undefined;
        return sendData(stateChanges)
    }else{
        return;
    }
}

exports.getState = () => {  
    return state;
}
exports.getStateDescr = () => { 
    return stateDescr;
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
    connectToService();
}

function getByValue(obj, searchValue) {
    var keys = Object.keys(obj);
    for(var i=0; i<keys.length; i++){
        var key = keys[i];
        if(obj[key]===searchValue)
            return key
    }
}