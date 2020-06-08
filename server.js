const vsx = require('./vsx')
let state ={};

function onVSXChanged(state){
    console.log(state)
    state.vsx = state
}

vsx.connect();
vsx.registerCallback(
   function() {
        //console.log(state)
        state.vsx = state
    }
);

setTimeout(
    function(){ vsx.send(["6MC","25FN"])
},3000)