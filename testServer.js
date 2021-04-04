const tv = require('./tv')


let TV_CALLBACKS = {
    onYoutubeOn: function(){
        console.log("YT on")
    },
    onNetflixOn: function(){
        console.log("Netflix on")
    },
}
tv.registerCallbacks(TV_CALLBACKS)

tv.start();


process.on('uncaughtException', function (err) {
    console.log("TV error");
}); 