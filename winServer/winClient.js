var os = require('os');

let pore = 8088;

//console.log(os.cpus());
console.log();
console.log()
setInterval(getSystemData,100)

function getSystemData(){
    let memUsage = (os.totalmem()-os.freemem())/ os.totalmem();
    let cpuUsage = os.cpus()
    cpuUsage = cpuUsage.map(e => e.times).map(e => {let w = (e.user+e.sys+e.irq); return w/(w+e.idle)}).reduce((a, b) => a + b) / cpuUsage.length;  //not working
    console.log(memUsage);
    console.log(cpuUsage)
}