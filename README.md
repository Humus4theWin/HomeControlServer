# HomeControl4Smarties
NodeJS Server agregating different consumer-product APIs to a single http-interface


# Idea
1. Building Modules for the following devices, which can (hopefully) be controlled directly by network comands or Bluetooth.

| Device               | type                        | interface          |
|----------------------|-----------------------------|--------------------|
| Pioneer VSX 922      | AV-Receiver                 | telnet             |
| TOSHIBA 55V6763DAL   | Television                  | WebSockets         |
| Boho Office Easydesk | height adjustment for table | Bluetooth          |
| Philipps Hue         | Smart Lights                | Restful API/  JSON |
| Windows 10(lock, CPU)| PC                          | ?? REST API        |

2. Building a Web-Interfac and Android (cross-plattform) App



# Sources
VSX-922: https://raymondjulin.com/blog/remote-control-your-pioneer-vsx-receiver-over-telnet/
TOSHIBA: https://shkspr.mobi/blog/2018/11/telnet-control-of-toshiba-smart-tvs/
