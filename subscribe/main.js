/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting
//Type Node.js Here :)

var pubnub = require("pubnub").init({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "pub-c-b073a796-1ecd-4c4b-8ad8-eddd09773555",
    subscribe_key : "sub-c-656b4f60-095c-11e6-a5b5-0619f8945a4f"
});

console.log('started...')

pubnub.subscribe({
    channel  : "channel_stefan",
    callback : function(message) {
        console.log( " temperature = ", message );
    }
});