const vsx = require('./vsx2')
const tv = require('./tv')
const hue = require('./hue')

let globalState ={};

globalState.vsx = vsx.getState();
globalState.tv = tv.getState();

let globalStateDescr ={};
globalStateDescr.vsx = vsx.getStateDescr();

//define Event Callbacks
let vsxCB = {}
vsxCB.onPowerOn = function(){
    hue.turnSub(true)

    console.log("onPowerOn")
}
vsxCB.onPowerOff =function(){
    hue.turnSub(false)

    console.log(globalState)
}
vsxCB.onMCACC =function(){
    console.log(globalState)
}
vsxCB.onVol = function(){
    console.log(globalState)
}
vsxCB.onChannel =function(){
   
}

let tvCB = {};
tvCB.onPowerOn = function(){
    console.log("TV on")
}
tvCB.onPowerOff =function(){
    console.log("TV off")
}

tvCB.onNetflixOn = function(){
    vsx.assureState({
        power: 'on',
        mcacc: 'Bett',
        volume: 125,
        input: 'TV'
    })
    console.log("onNetflixOn")
}
tvCB.onNetflixOff = function(){
    if(globalState.vsx.input=='TV')
        vsx.assureState({
            volume: 100
        })
    console.log("onNetflixOff")
}

tvCB.onYoutubeOn =function(){    
    vsx.assureState({
        power: 'on',
        mcacc: 'Bett',
        volume: 125,
        input: 'TV'
    })

    console.log("onYoutubeOn")
}
tvCB.onYoutubeOff =function(){
    if(globalState.vsx.input=='TV')
        vsx.assureState({
            volume: 100
        })
    console.log("onYoutubeOff")
}

tv.registerCallbacks(tvCB)
tv.start();
vsx.registerCallbacks(vsxCB)
vsx.start();

// Server part
const express = require('express')
const app = express()
const port = 80


// endpoints
app.get('/vsx_vol_dwn', (req, res) => {
    
    vsx.assureState({
        power: 'on',
        mcacc: 'PC',
        volume: globalState.vsx.volume -20,
        input: 'PC'
    })

    res.send('ok')
})

app.get('/vsx_vol_up', (req, res) => {
    
    vsx.assureState({
        power: 'on',
        mcacc: 'PC',
        volume: globalState.vsx.power==='on'&&globalState.vsx.input=='PC'?globalState.vsx.volume +20:80,
        input: 'PC'
    })

    res.send('ok')
})

app.get('/vsx_mcacc_bett', (req, res) => {
    
    vsx.assureState({
        mcacc: 'BETT',
        
    })

    res.send('ok')
})
app.get('/vsx_mcacc_pc', (req, res) => {
    
    vsx.assureState({
        mcacc: 'PC',
    })

    res.send('ok')
})

app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`)
})