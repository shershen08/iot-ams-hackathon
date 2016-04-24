// configure jshint
/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

/**
 * add modules
 */
var mraa = require('mraa');
var bz = require("jsupm_buzzer").Buzzer;
var scr = require('./screen.js');
var lcd = require('jsupm_i2clcd');
var groveSensor = require('jsupm_grove');
var pubnub = require("pubnub");

/**
 * app configs
 */
var REFRESH_INTERVAL = 500;
var FIRE_TEMPERATURE = 25.5;

/**
 * init led
 */
var myOnboardLed4 = new mraa.Gpio(4); //RED
myOnboardLed4.dir(mraa.DIR_OUT);
myOnboardLed4.write(1);

/**
 * init pubnub instance
 */
var publisher = pubnub.init({
    ssl: true, // <- enable TLS Tunneling over TCP
    publish_key: "pub-c-b073a796-1ecd-4c4b-8ad8-eddd09773555",
    subscribe_key: "sub-c-656b4f60-095c-11e6-a5b5-0619f8945a4f"
});

/**
 * init temperature meter
 */
var myTemperaturePin = new mraa.Aio(0);
//var light = new groveSensor.GroveLight(1);
//var groveRotary = new groveSensor.GroveRotary(1);

/**
 * init sound and display
 */
var buzzer = new(bz)(3);
var display = new lcd.Jhd1313m1(0, 0x3E, 0x62);

/**
 * data sender
 */
function sendData(temp_data_float) {
    publisher.publish({
        channel: 'channel_stefan',
        message: ({ 'temperature': temp_data_float }),
        callback: function(e) { console.log("sent to pubnub", e); },
        error: function(e) { console.log("FAILED!", e); }
    });
}

function getTemperature() {
    var B = 3975;
    var a = myTemperaturePin.read();
    var resistance = (1023 - a) * 10000 / a; //get the resistance of the sensor;
    var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15;
    return celsius_temperature;
}
/**
 * !not used!
 */
function mR() {
    var abs = groveRotary.abs_value();
    var absdeg = groveRotary.abs_deg();
    var absrad = groveRotary.abs_rad();

    var rel = groveRotary.rel_value();
    var reldeg = groveRotary.rel_deg();
    var relrad = groveRotary.rel_rad();

    //write the knob value to the console in different formats
    console.log("Abs: " + abs + " " + Math.round(parseInt(absdeg)) + " " + absrad.toFixed(3));
    console.log("Rel: " + rel + " " + Math.round(parseInt(reldeg)) + " " + relrad.toFixed(3));

}

function displayText(text) {

    //var l = light.raw_value();
    //console.log(l);
    // mR();

    var currentdate = new Date();
    var time = "" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

    display.setCursor(0, 0);
    display.write(time);
    display.setCursor(1, 0);

    var tempCelcius = getTemperature();
    display.write(tempCelcius + ' C');

    if (tempCelcius > FIRE_TEMPERATURE) {
        myOnboardLed4.write(1);
        display.setColor(255, 0, 0);
        buzz();
    } else {
        myOnboardLed4.write(0);
        display.setColor(255, 255, 255);
        stopBuzzing();
    }

    sendData(tempCelcius);
}


//scr.rotateColors(display);
// scr.timecheck();


setInterval(function() {

    displayText();

}, REFRESH_INTERVAL);

function buzz(freq) {
    buzzer.setVolume(0.5);
    buzzer.playSound((freq || 26) * 1000, 0);
}

function stopBuzzing() {
    buzzer.stopSound();
    buzzer.stopSound(); // if called only once, buzzer doesn't completely stop
}
