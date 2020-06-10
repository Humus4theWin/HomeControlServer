const vsx = require('./vsx')
let globalState ={};

globalState.vsx = vsx.getState();
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



vsx.registerCallbacks(vsxCB)
vsx.start();


setTimeout(()=> {
    vsx.assureState({
        power: true,
        mcacc: globalState.vsx.mcacc.values.PC,
        volume: 60,
        input: globalState.vsx.input.values.Chromecast
    })

},2000)