const host = window.location.host

// 创建websocket连接
const socket = new WebSocket('ws://' + host);
// 如果是部署到服务器并配置了SSL证书，应该使用wss协议 
// const socket = new WebSocket('wss://'+host);
let equipmentId = window.location.pathname.split("/")[2] || Math.floor(Math.random() * 10000)
let Ydata = []
let _data = []
// 如果建立连接
socket.onopen = function () {
    console.log("websocket connect!")
    let data = JSON.stringify({
        equipmentId: equipmentId
    })
    if (_data.length == 0){
        chart.showLoading()
    }
    socket.send(data)
}
// 监听接收数据
socket.onmessage = function (msg) {
    try {
        _data = []
        let data = JSON.parse(msg.data)
        Ydata = data.value.splice(1, data.value.length)
        
        for (let i in Ydata) {
            _data.push([(parseInt(i) + 1) * 50, Ydata[i]])

        }
        chart.hideLoading()
        chart.update({
            series: [{
                data: _data
            }]
        });
        console.log('chart', chart)
        // myChart.setOption(option)
        console.log("data:", _data)
    } catch (error) {
        console.log('error:', error)
    }
}
socket.onclose = function () {
    console.log("websocket close.")
}
socket.onerror = function () {
    console.log("websocket error:", event)
}


// hgihtcharts____________________
$(window).resize(function () {
    if (chart) {
        chart.setSize(
            $(document).width(),
            $(document).height(),
            false
        );
    }
});
chart = Highcharts.chart('container', {
    chart: {
        loading: {
            labelStyle: {
                color: 'red'
            },
            style: {
                backgroundColor: 'red'
            },
            hideDuration: 1000,
            showDuration: 1000
        },
        animation: {
            duration: 1500,
            easing: 'easeOutBounce'
        },
        borderRadius: 20,
        borderWidth: 2,
        panning: true,
        panKey: 'shift',
        inverted: true,
        ignoreHiddenSeries: true,
        zoomType: 'x'
    },
    title: {
        text: '频率图'
    },
    subtitle: {
        text: 'Click and drag to zoom in. Hold down shift key to pan.'
    },
    subtitle: {
        text: document.ontouchstart === undefined ?
            '鼠标拖动可以进行缩放' : '手势操作进行缩放'
    },
    xAxis: {
        // type: 'datetime',
        // dateTimeLabelFormats: {
        //     millisecond: '%H:%M:%S.%L',
        //     second: '%H:%M:%S',
        //     minute: '%H:%M',
        //     hour: '%H:%M',
        //     day: '%m-%d',
        //     week: '%m-%d',
        //     month: '%Y-%m',
        //     year: '%Y'
        // }
    },
    tooltip: {
        // dateTimeLabelFormats: {
        //     millisecond: '%H:%M:%S.%L',
        //     second: '%H:%M:%S',
        //     minute: '%H:%M',
        //     hour: '%H:%M',
        //     day: '%Y-%m-%d',
        //     week: '%m-%d',
        //     month: '%Y-%m',
        //     year: '%Y'
        // }
    },
    yAxis: {
        title: {
            text: '频率'
        }
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        area: {
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, new Highcharts.getOptions().colors[0]],
                    [1, new Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
            marker: {
                radius: 2
            },
            lineWidth: 1,
            states: {
                hover: {
                    lineWidth: 1
                }
            },
            threshold: null
        }
    },
    series: [{
        type: 'area',
        name: 'value',
        data: _data
    }]
});