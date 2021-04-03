const vsx = require('./vsx')
const hue = require('./hue')
const tv = require('./tv')



//parameter 
let startTime = 20; //21 Uhr
let targetVolume = 41 // -60db
let decreaseVolume = 1 ; // -0,5db
let changeIntervall = 1 * 60 * 1000 // each Minute

let lastManualVolShift = new Date();    //
let restTimeAfterManualShift = 20 * 60 *1000; //20 minutes


//define Event Callbacks

function VSX_CALLBACK(oldState, newState) {

    // subwoofer
    if(newState.power === true && new Date().getHours < startTime)
        hue.turnSub(true)
    else if(newState.power === false)
        hue.turnSub(false)

    // volume offset after 1s
    if(newState.input){
        let volumeOffset =  vsx.getInputOffset(newState.input) - vsx.getInputOffset(oldState.input);
        let newVolume  = oldState.volume + volumeOffset

        console.log("Input Offseets/Volume: " +volumeOffset + "/"+ newVolume)
        if ( newVolume<0) newVolume = 41
            
        if(volumeOffset && newVolume)
        
        vsx.assureState({
            volume: 41 + vsx.getInputOffset(oldState.input)
        })
    }
    else if(newState.power)    // change volume at turn on
    vsx.assureState({
        volume: oldState.volume + 
    })

    //save timestmp of vol shift 
    if(newState.volume && Math.abs(newState.volume-oldState.volume)==1)
        lastManualVolShift = new Date();
}
vsx.registerCallback(VSX_CALLBACK);
vsx.start();



// TV
let TV_CALLBACKS = {
    onYoutubeOn: function(){
       vsx.assureState({
           power: true,
           input: 'TV',
           mcacc:3,
       })
       hue.turnLightsOn(false)
    },

    onNetflixOn: function(){
        vsx.assureState({
            power: true,
            input: 'TV',
            mcacc:3,
        })
        hue.turnLightsOn(false)
    },
}
tv.registerCallbacks(TV_CALLBACKS)
tv.start();

// TV workaround
process.on('uncaughtException', function (err) {
    //console.log(err);
}); 




// auto volume decrease at evening
setInterval(() => {
    let now = new Date() //make sure your system is set to correct Timezone
    
    if(now.getHours()>=startTime){    // time is reached
        let state = vsx.getState();  
        //console.log("Time " + now.getHours() +":" + now.getMinutes() + "Vol: "+ state.volume)
        //console.log("time since vol" + (new Date() - lastManualVolShift))                             

        // turn sub off routine
        if(now.getHours()==startTime && now.getMinutes()<=changeIntervall)  //first 
            hue.turnSub(false);

            // decrease Volume routine
            if(state.volume - vsx.getInputOffset(state.input)>targetVolume    // volume to loud
               && new Date() - lastManualVolShift > restTimeAfterManualShift){ // no rest time
                vsx.assureState({
                    volume: state.volume - decreaseVolume
                })
            }
    }
    
}, changeIntervall);






const express = require('express')
const app = express()
const port = 81


// HTTP endpoints

app.get('/vsx_vol_dwn', (req, res) => {
    vsx.assureState({
        power: true,
        volume: vsx.getState().volume -10,

    })

    res.send('ok')
})

app.get('/vsx_vol_up', (req, res) => {
    vsx.assureState({
        power: true,
        volume: vsx.getState().volume +10,
    })

    res.send('ok')
})

app.get('/vol_PC', (req, res) => {
    vsx.assureState({
        power: true,
        mcacc: 1,
        input: 'PC'
    })

    res.send('ok')
})

app.get('/PC_Display_off', (req, res) => {
        vsx.assureState({
            mcacc: 2,
        })
        
        hue.turnLightsOn(false)

    res.send('ok')
})
app.get('/PC_Display_on', (req, res) => {
    vsx.assureState({
       mcacc: 1
    })

    let hour = new Date().getHours();
    hue.turnLightsOn(hour>6&&hour<20)

    res.send('ok')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    })

