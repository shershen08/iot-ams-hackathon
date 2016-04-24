pubnub = PUBNUB({
    publish_key: 'pub-c-eb8c658b-96ab-43b4-8bb0-b1e04d58230f',
    subscribe_key: 'sub-c-7427db94-095d-11e6-b422-0619f8945a4f'
})
var pushdata = function() {
    pubnub.publish({
        channel: 'Channel-a7fmfikxg',
        message: 'Hello from the PubNub Javascript SDK!',
        callback: function(m) { console.log(m) }
    });

}

pubnub.subscribe({
    channel: "Channel-a7fmfikxg",
    message: function(message, envelope, channelOrGroup, time, channel) {
        console.log(
            "Message Received." + "\n" +
            "Channel or Group: " + JSON.stringify(channelOrGroup) + "\n" +
            "Channel: " + JSON.stringify(channel) + "\n" +
            "Message: " + JSON.stringify(message) + "\n" +
            "Time: " + time + "\n" +
            "Raw Envelope: " + JSON.stringify(envelope)
        )
    },
    connect: pub
});

function pub() {
    console.log("Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish.");
    pubnub.publish({
        channel: "hello_world",
        message: "Hello from PubNub Docs!",
        callback: function(m) { console.log(m) }
    })
}


$(document).ready(function($) {
    $('#push').click(function(event) {
        pushdata();
    });
})
