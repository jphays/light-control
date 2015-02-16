var _ = require('lodash');
var ArduinoFirmata = require('arduino-firmata');
var Color = require('color');

var scenes = require('./scenes');
var transitions = require('./transitions');

var SYSEX_SET_COLORS = 0x01;

var options =
{
    ledCount: 50,
    fps: 30,
    sceneLength: 12,  // seconds
    transitionTime: 3 // seconds
};

var state =
{
    time: 0,
    frame: 0,
    leds: [],
    scene: _.sample(scenes.all),
    nextScene: null,
    lastTransitionTime: 0,
    transition: null,
    loopInterval: null
};

var arduino = new ArduinoFirmata();

init();

// Initialization

function init()
{
    console.log("leds: " + options.ledCount + " | " + options.fps + " fps");

    initCallbacks();

    console.log("connecting...");
    arduino.connect();
}

function initCallbacks()
{

    // arduino connection
    arduino.on('connect', function()
    {
        console.log("connected: " + arduino.boardVersion + " (" + arduino.serialport_name + ")");

        // init scene
        state.scene.init(options);
        console.log("scene: " + state.scene.name);
        state.lastTransitionTime = Date.now();

        // start main loop
        state.loopInterval = setInterval(loop, 1000 / options.fps);
    });

    // sysex callback
    arduino.on('sysex', function(e)
    {
        console.log("sysex received.");
        console.log("command : " + e.command);
        console.log("data    : " + JSON.stringify(e.data));
    });

    // handle ctrl+c gracefully
    process.on('SIGINT', function()
    {
        console.log("caught interrupt signal.");
        arduino.close(function() {
            console.log("connection closed.");
            clearInterval(state.loopInterval);
            process.exit();
        });
    });

}

// main loop

function loop()
{
    state.time = Date.now();
    state.frame++;

    state.leds = generateFrame();
    sendColors(state.leds);
}

function generateFrame()
{
    if (state.time > state.lastTransitionTime + (options.sceneLength * 1000))
    {
        // transition begins

        state.lastTransitionTime = state.time;
        state.transition = _.sample(transitions.all);
        state.nextScene = _.sample(_.filter(scenes.all, function(scene) { return scene.name != state.scene.name }));
        state.nextScene.init(options);
        console.log("transition: " + state.scene.name + " -> " + state.nextScene.name);
    }
    else if (state.time < state.lastTransitionTime + (options.transitionTime * 1000) && state.nextScene)
    {
        // transition underway

        return state.transition(state.scene.render(state),
                                state.nextScene.render(state),
                                state.lastTransitionTime, options.transitionTime * 1000,
                                state, { color: "white" });
    }
    else if (state.nextScene)
    {
        // transition ends

        state.scene = state.nextScene;
        state.nextScene = null;
        console.log("transition complete: " + state.scene.name);
    }

    return state.scene.render(state);
}

// Send colors

function getBytes(strand)
{
    var ledStrand = [];
    for (var i = 0; i < strand.length; i++)
    {
        var colorRgb = strand[i].rgb();
        ledStrand.push(colorRgb.r, colorRgb.g, colorRgb.b);
    }
    return ledStrand;
}

function sendColors(strand)
{
    var bytes = getBytes(strand);
    arduino.sysex(SYSEX_SET_COLORS, bytes, function()
    {
        if (state.frame % 10 == 0) console.log(state.frame + " | " + strand[0].hslString());
    });
}
