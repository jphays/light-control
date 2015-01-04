var ArduinoFirmata = require('arduino-firmata');

var arduino = new ArduinoFirmata();

var LEDS = 10;
var leds = [];
          // [ 127,   0,   0,
          //     0, 127,   0,
          //     0,   0, 127 ];

init();

function init()
{
    console.log("init!");
    
    for (var i = 0; i < LEDS; i++)
    {
        leds[i] = [];
        for (var c = 0; c < 3; c++)
        {
            leds[i][c] = 0;
        }
    }

    process.on('SIGINT', function()
    {
        console.log("caught interrupt signal.");
        arduino.close(function() {
            console.log("connection closed.");
            process.exit();
        });
    });

    console.log("connecting...");
    arduino.connect('/dev/tty.usbserial-A100X098');
}

function loop()
{
    console.log("loop!");
    randomizeLeds();
    sendColors();
    //setTimeout(loop, 1000);
}

function randomizeLeds()
{
    for (var i = 0; i < LEDS; i++)
    {
        leds[i][0] = Math.random() > 0.5 ? 64 : 0;
        leds[i][1] = Math.random() > 0.5 ? 64 : 0;
        leds[i][2] = Math.random() > 0.5 ? 64 : 0;
    }
}

function sendColors()
{
    var ledStrand = getStrand();
    arduino.sysex(0x01, ledStrand, sysexCompleteCallback);
}

function sysexCompleteCallback()
{
    console.log("sysex sent.");
    setTimeout(loop, 1000);
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

arduino.on('connect', function()
{
    console.log("connected: " + arduino.boardVersion);
    loop();
});

arduino.on('sysex', function(e)
{
    console.log("sysex received.");
    console.log("command : " + e.command);
    console.log("data    : " + JSON.stringify(e.data));
});
