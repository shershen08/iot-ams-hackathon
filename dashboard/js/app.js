var CHANNELS = [
    'channel_stefan', 'channel_merlando', 'channel_mikhail'
];
var data = [
    [],
    [],
    []
];

pubnub = PUBNUB({
    publish_key: 'pub-c-b073a796-1ecd-4c4b-8ad8-eddd09773555',
    subscribe_key: 'sub-c-656b4f60-095c-11e6-a5b5-0619f8945a4f'
});

CHANNELS.forEach(function(item, index) {

    jQuery('.bot-title:eq(' + index + ')').text(item.split('_')[1]);

    pubnub.subscribe({
        channel: item,
        message: function(message, envelope, channelOrGroup, time, channel) {

            if (data[index].length && data[index].length > 60) {
                data[index] = data[index].slice(1);
            }
            if (message.temperature) {
                data[index].push(message.temperature);
                $('#' + item).text((message.temperature + '').substr(0, 5) + ' C');
            }
        },
        connect: pub
    });

})

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



function pub() {
    // pubnub.publish({
    //     channel: "channel_stefan",
    //     message: { 'temperature': 0 },
    //     callback: function(m) { console.log(m) }
    // })

}

function getTemperatureData(index) {

    var res = [];
    for (var i = 0; i < data[index].length; ++i) {
        res.push([i, data[index][i]])
    }
    return res;
}

$(document).ready(function($) {
    $('#push').click(function(event) {
        pushdata();
    });
})


$(function() {

    var series = [{
        data: [
            [0, 0]
        ],
        lines: {
            fill: true
        }
    }];

    $(".flot-line-chart-moving").each(function(index, el) {

        var container = $(this);
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

        setInterval(function updateRandom() {
            series[0].data = getTemperatureData(index);
            plot.setData(series);
            plot.draw();
        }, 60); //40

    });
});
