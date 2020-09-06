const vsx = require('./vsx')
const tv = require('./tv')
let globalState ={};

globalState.vsx = vsx.getState();
globalState.tv = tv.getState();

//define Event Callbacks
let vsxCB = {}
vsxCB.onPowerOn = function(){
    console.log("onPowerOn")
}
vsxCB.onPowerOff =function(){
    console.log(globalState)
}
vsxCB.onMCACC =function(){
    console.log(globalState)
}
vsxCB.onVol = function(){
    console.log(globalState)
}
vsxCB.onChannel =function(){
    console.log(globalState)
}


let tvCB = {};
tvCB.onPowerOn = function(){
    console.log("TV on")
}
tvCB.onPowerOff =function(){
    console.log("TV off")
}

tvCB.onNetflixOn = function(){
    console.log("onNetflixOn")
}
tvCB.onNetflixOff = function(){
    console.log("onNetflixOff")
}

tvCB.onYoutubeOn =function(){
    console.log("onYoutubeOn")
}
tvCB.onYoutubeOff =function(){
    console.log("onYoutubeOff")
}


tv.registerCallbacks(tvCB)
tv.start();


vsx.registerCallbacks(vsxCB)
vsx.start();





//scenes


setTimeout(()=> {
    vsx.assureState({
        power: true,
        mcacc: globalState.vsx.mcacc.values.PC,
        volume: 60,
        input: globalState.vsx.input.values.Chromecast
    })

},20000000)