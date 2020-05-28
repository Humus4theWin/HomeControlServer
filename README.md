# HomeControl4Smarties
NodeJS Server agregating different consumer-product APIs to a single http-interface

# Vision
Let go to bed late, after a full day of programming and wanning to watch ne new nextflix movie.
But nneding several remotes, laying somewhere in the room is not suitable for a lazy programmer.
So let me open my HomeControl App, pressing the "netflix button" an boom:
- the Lights are dimming (maybe starting HueSync)
- The AV-Receiver turns on, automatically switches the input channel, adjusts the volume and MCACC and dimmes its display.
- The TV turns on and starts the Netflix app
- my Phones starts the netflix app, to let me control the TV and choose my favourite movie.
- my Desk lifts down, to let me have a clear view on the TV. 

And all that, even if some devices are already turned on ;)


# Idea
1. Building Modules for the following devices, which can (hopefully) be controlled directly by network comands or Bluetooth.

| Device               | type                        | interface          |
|----------------------|-----------------------------|--------------------|
| Pioneer VSX 922      | AV-Receiver                 | telnet             |
| TOSHIBA 55V6763DAL   | Television                  | WebSockets         |
| Boho Office Easydesk | height adjustment for table | Bluetooth          |
| Philipps Hue         | Smart Lights                | Restful API/  JSON |
| Windows 10(lock, CPU)| PC                          | ?? REST API        |

2. Building a Web-Interfac and Android (or cross-plattform) App.



# Sources
- VSX-922: https://raymondjulin.com/blog/remote-control-your-pioneer-vsx-receiver-over-telnet/
- TOSHIBA: https://shkspr.mobi/blog/2018/11/telnet-control-of-toshiba-smart-tvs/
          https://github.com/T3m3z/pyvesteltv/blob/master/pyvesteltv/broadcast.py

# Similar Projects
- https://github.com/stormboy/node-pioneer-avr/blob/master/pioneer-avr.js
