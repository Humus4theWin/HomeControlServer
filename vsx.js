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
                range:[true, false],
                value: undefined,
                switch: async function (newState){
                    writeData(newState.power?"PO":"PF")
                     if(newState.power===true&&state.power.value!==true) await sleep(2000);
                },
                check: function (line){
                    if(line.startsWith("PWR1")&&state.power.value !== false){
                        state.power.value = false;
                        return true;
                    }
                    else if(line.startsWith("PWR0")&&state.power.value !== true){
                        state.power.value  = true;
                        return true;
                    }
                    return false;
                },
            },
            volume:{
                range:  [20,40,60,80,100,120],    //[000,185],
                value: undefined,
                switch: async function (newState){
                    let volStr = "" + newState.volume + "vl";
                    if(volStr.length===3)
                        volStr = "00" + volStr;
                    else if(volStr.length===4)
                        volStr = "0" + volStr;
            
                    writeData(volStr);
                },
                check: function (line){
                    if(line.startsWith("VOL"))
                        state.volume.value = parseInt(line.substr(3,3));

                    else return false;
                    return true;
                },
            },   
            input:{
                range:{
                    Chromecast:"21",
                    Dock:"25",
                    BT:"15",
                    PC:"01",
                    TV:"05",
                    PS3:"06",
                    PS4:"04",
                    SPOTIFY:"44",
                },
                value: undefined,
                switch: async function (newState){
                    writeData(state.input.range[newState.input] + "FN");
                },
                check: function (line){
                    if(line.startsWith("FN")){
                        state.input.value = getByValue(state.input.range, line.substr(2,2))
                    }else return false;
                    return true;
                },
            } ,
            mcacc:{
                range:[1,2,3,4,5,6],
                value: undefined,
                switch: async function (newState){
                    writeData(newState.mcacc + "MC");
                },
                check: function (line){
                    if(line.startsWith("MC")){
                        state.mcacc.value = Number(line.substr(2,1))
                    }else return false;
                    return true;
                },
            }
    }


    
    let connect = function() {
        var self = this;
        client = net.connect(options);
    
        client.on("connect", function(socket) {
            console.log("VSX connected");
            connected=true;
            setTimeout(reqData, 200);
        });
    
        client.on("data", function(data) {
            recData(data);
        });
    
        client.on("end", function() {
            console.log("VSX disconnected");
            connected=false;
            //connect();
        });
        client.on("close", function() {
            console.log("VSX close");
            connected=false;
            //connect();
        });

        client.on("timeout", function() {
            console.log("VSX timeout");
            connected=false;
            //connect();
        });
    
        client.on("error", function(err) {
            console.log(err);
            let client = connect();
            connected=false;
            client.close();
            setTimeout(()=> {
                console.log("VSX try reconnect");
                connect();
            },10000);
        });
    };


let recData = function(buffer){
    var data = buffer.toString();
    var length = data.lastIndexOf('\r');
    data = data.substr(0, length);
    data = data.split("\n")

    let changesStateNames = [];
    let stateBefore = reduceState(state, Object.keys(state))
    data.forEach( line => {
        Object.keys(state).forEach(stateName => {
            if( state[stateName].check(line))
                changesStateNames.push(stateName)
            }
        )
        console.log("<-- "+ line)
    })
    if(changesStateNames.length>0){
        console.log("\n state Changed: " )
        console.log(reduceState(state, changesStateNames))
        callbackFunction(stateBefore, reduceState(state, changesStateNames));
    }
        
       
}

let reqData = function(){
    client.write("?P\r");
    client.write("?V\r");
    client.write("?F\r");
    client.write("?MC\r");
}

let writeData = function(line){
    client.write(line + "\r");
    console.log("--> "+ line)
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function getByValue(obj, searchValue) {
    var keys = Object.keys(obj);
    for(var i=0; i<keys.length; i++){
        var key = keys[i];
        if(obj[key]===searchValue)
            return key
    }
}

function reduceState(stateObj, stateNames){
    let output = {}
    stateNames.forEach( stateName =>  output[stateName] = stateObj[stateName].value)
   return output;
    
}

exports.getState = () => {  
    return reduceState(state, Object.keys(state))
}

exports.getControls = () => {       // for frontend
    let output = {}
    Object.keys(state).forEach( stateName =>  {
        output[stateName] = {}
        output[stateName].value = state[stateName].value
        output[stateName].range = state[stateName].range
    });

    return output;
}

let callbackFunction = {};
exports.registerCallback = (cb) => {  
    callbackFunction = cb;
}
exports.assureState = async function (newState) {  
    console.log("\n change Request: ")
    console.log(newState)
    for(let key in newState){
        console.log(key)
        await state[key].switch(newState) 
    }
    
}


exports.start = () => {  
    connect();
}
exports.getInputOffset = (device) => {
    let devices = {
        PC: 25,
        BT: 30,
        TV: 30,
    }
    let offset = devices[device]
    if ( offset) return offset;
    return 0;
}
