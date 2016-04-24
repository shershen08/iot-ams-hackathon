var CHANNELS = [
    'channel_stefan', 'channel_merlando', 'channel_mikhail'
];

pubnub = PUBNUB({
    publish_key: 'pub-c-b073a796-1ecd-4c4b-8ad8-eddd09773555',
    subscribe_key: 'sub-c-656b4f60-095c-11e6-a5b5-0619f8945a4f'
});

CHANNELS.forEach(function(item, index) {


})

var data = [];
var innerCounter = 0;

/**
 * send data from desktop,
 * just for testing
 */
var pushdata = function() {
    pubnub.publish({
        channel: 'channel_stefan',
        message: { 'temperature': 0 },
        callback: function(m) { console.log(m) }
    });
}

pubnub.subscribe({
    channel: CHANNELS[0],
    message: function(message, envelope, channelOrGroup, time, channel) {
        /* console.log(
             "Channel: " + JSON.stringify(channel) + "\n" +
             "Message: " + JSON.stringify(message) + "\n"
         );*/

        if (data.length && data.length > 50) {
            data = data.slice(1);
        }

        innerCounter++;
        if (message.temperature) {
            data.push(message.temperature);
            $('#channel_stefan').text((message.temperature + '').substr(0, 5) + ' C');
        }
    },
    connect: pub
});

function pub() {
    console.log("Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish.");
    pubnub.publish({
        channel: "channel_stefan",
        message: { 'temperature': 0 },
        callback: function(m) { console.log(m) }
    })
}

function getTemparatureData() {

    var res = [];
    for (var i = 0; i < data.length; ++i) {
        res.push([i, data[i]])
    }
    return res;
}

$(document).ready(function($) {
    $('#push').click(function(event) {
        pushdata();
    });
})


$(function() {

    var container = $("#flot-line-chart-moving");

    series = [{
        data: [
            [0, 0]
        ],
        lines: {
            fill: true
        }
    }];


    var plot = $.plot(container, series, {
        grid: {

            color: "#999999",
            tickColor: "#D4D4D4",
            borderWidth: 0,
            minBorderMargin: 20,
            labelMargin: 10,
            backgroundColor: {
                colors: ["#ffffff", "#ffffff"]
            },
            margin: {
                top: 8,
                bottom: 20,
                left: 20
            },
            markings: function(axes) {
                var markings = [];
                var xaxis = axes.xaxis;
                for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
                    markings.push({
                        xaxis: {
                            from: x,
                            to: x + xaxis.tickSize
                        },
                        color: "#fff"
                    });
                }
                return markings;
            }
        },
        colors: ["#1ab394"],
        xaxis: {
            tickFormatter: function() {
                return "";
            }
        },
        yaxis: {
            min: 15,
            max: 35
        },
        legend: {
            show: true
        }
    });

    window.e = setInterval(function updateRandom() {
        series[0].data = getTemparatureData();
        plot.setData(series);
        plot.draw();
    }, 100); //40

});
