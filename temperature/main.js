var B = 3975;
var mraa = require("mraa");

//GROVE Kit A0 Connector --> Aio(0)
var myAnalogPin = new mraa.Aio(0);

/*
Function: startSensorWatch(pubnub)
Parameters: pubnub - client communication channel
Description: Read Temperature Sensor and send temperature in degrees of Celcius every 4 seconds
*/



function startSensorWatch(pubnub) {
    'use strict';
    setInterval(function () {
        var a = myAnalogPin.read();
        console.log("Analog Pin (A0) Output: " + a);
        //console.log("Checking....");
        
        var resistance = (1023 - a) * 10000 / a; //get the resistance of the sensor;
        //console.log("Resistance: "+resistance);
        var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15;//convert to temperature via datasheet ;
        console.log("Celsius Temperature "+celsius_temperature); 
//        var fahrenheit_temperature = (celsius_temperature * (9 / 5)) + 32;
//        console.log("Fahrenheit Temperature: " + fahrenheit_temperature);
        pubnub.publish({ 
            channel   : 'channel_stefan',
            message   : celsius_temperature,
            callback  : function(e) { console.log( "Published temperature to pubnub", e ); },
            error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
        });
    }, 4000);
}

console.log("Sample Reading Grove Kit Temperature Sensor");

var pubnub = require("pubnub").init({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "pub-c-b073a796-1ecd-4c4b-8ad8-eddd09773555",
    subscribe_key : "sub-c-656b4f60-095c-11e6-a5b5-0619f8945a4f"
});

startSensorWatch(pubnub);

