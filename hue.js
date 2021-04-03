const axios = require('axios')

let baseURL = "http://192.168.188.116/api/kYibW7kfMgNcVO8aOVU6-WhgDvk1JR7bWnwuagdb/"
let state = {
    groups:{
        Zimmer:{
            id:1,
            state: undefined
        }
    },
    scenes:{
        Zocken:{
            id:"J15Eq3ZI8o0xmDT",
            state: undefined
        },
        Fire:{
            id:"nnCxQ8vzAESYx6l",
            state: undefined
        },
        DarkColorDreamm:{
            id:"CENRDn4vAQf4hRf",
            state: undefined
        },
        LightColorDreamm:{
            id:"2hcllLNsL5HbqQI",
            state: undefined
        },
        ChillPC:{
            id:"sjr2mqbSaHvy8sJ",
            state: undefined
        },
        Konzentrieren:{
            id:"hGXtjijDGw6UFoL",
            state: undefined
        },
        Hell:{
            id:"ZYt9Y6Xri8ab1Qs",
            state: undefined
        },    
    }
}

function activateScene(scene){
    let url = "http://192.168.188.116/api/kYibW7kfMgNcVO8aOVU6-WhgDvk1JR7bWnwuagdb/groups/1/action"
    let body ="{\"scene\": \""+scene.id+"\"}";
    axios.put(url,body)
}

function getRoomState(scene){
    axios.get("http://192.168.188.116/api/kYibW7kfMgNcVO8aOVU6-WhgDvk1JR7bWnwuagdb/groups/1/").then((res)=> {
        if(state.groups.Zimmer.state.on!== res.data.action.on){

        }    

        state.groups.Zimmer.state=res.data.action;

    })
}
function restoreState(scene){
    axios.put("http://192.168.188.116/api/kYibW7kfMgNcVO8aOVU6-WhgDvk1JR7bWnwuagdb/groups/1/action",state.groups.Zimmer.state)
}

//activateScene(state.scenes.Hell)

//setInterval(getRoomState,500)

function getPowerStatus(){
    axios.get("http://192.168.188.116/api/kYibW7kfMgNcVO8aOVU6-WhgDvk1JR7bWnwuagdb/groups/1/").then((res)=> state.groups.Zimmer.state=res.data.action)
}



exports.turnSub = (powerState) => {  
    console.log("HUE SW: "+ powerState)
    let SWURL =  "http://192.168.188.116/api/kYibW7kfMgNcVO8aOVU6-WhgDvk1JR7bWnwuagdb/lights/30/state"
    axios.put(SWURL, {"on":powerState})
}

exports.turnLightsOn = (bright) => {  
    console.log("HUE Lights on, bright: " + bright)
    let SWURL =  "http://192.168.188.116/api/kYibW7kfMgNcVO8aOVU6-WhgDvk1JR7bWnwuagdb/groups/1/action"
    axios.put(SWURL, {"scene":bright?state.scenes.Konzentrieren.id:state.scenes.ChillPC.id})
}