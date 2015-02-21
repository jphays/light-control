# light-control
Javascript control module for TCL LEDs on Arduino via Firmata.

After playing for a while with Total Control Lighting RGB LEDs controlled by an
Arduino, I started to want more flexibility and the ability to make changes
more quickly. I settled on Firmata as a protocol (with a custom sysex call to
send color data) and node.js as a control platform. The Arduino firmware is at
[tcl-firmata](https://github.com/jphays/tcl-firmata).

__TODO:__
- update the protocol to handle 7-bit bytes specified by the protocol
- more scenes, and more flexibility per scene
- more palettes and transitions
- 2D rendering
- feedback from the inputs on the developer shield (pots, buttons, switches)
