
var ArduinoFirmata = require('arduino-firmata');

var arduino = new ArduinoFirmata();

var LEDS = 10;
var leds = [];
          // [ 127,   0,   0,
          //     0, 127,   0,
          //     0,   0, 127 ];

setup();

function setup()
{
    console.log('setup!');
    arduino.connect('/dev/tty.usbserial-A100X098');
    
    for (var i = 0; i < LEDS; i++)
    {
        leds[i] = [];
        for (var c = 0; c < 3; c++)
        {
            leds[i][c] = 0;
        }
   }
}

function loop()
{
    console.log('loop!');
    randomizeLeds();
    sendColors();
    setTimeout(loop, 100);
}

function randomizeLeds()
{
    for (var i = 0; i < LEDS; i++)
    {
        leds[i][0] = Math.random() > 0.5 ? 127 : 0;
        leds[i][1] = Math.random() > 0.5 ? 127 : 0; 
        leds[i][2] = Math.random() > 0.5 ? 127 : 0; 
    }
}

function getStrand()
{
    var ledStrand = [];
    for (var i = 0; i < leds.length; i++)
    {
        for (var c = 0; c < 3; c++)
        {
            ledStrand.push(leds[i][c]);
        }
    }
    return ledStrand;
}

function sendColors()
{
    var ledStrand = getStrand();
    arduino.sysex(0x01, ledStrand);
}

arduino.on('connect', function()
{
    console.log("Connected: " + arduino.boardVersion);
    setup();
    loop();
});

arduino.on('sysex', function(e)
{
    console.log("command : " + e.command);
    console.log("data    : " + JSON.stringify(e.data));
});
