const host = window.location.host

// 创建websocket连接
const socket = new WebSocket('ws://' + host);
// 如果是部署到服务器并配置了SSL证书，应该使用wss协议 
// const socket = new WebSocket('wss://'+host);
let equipmentId = window.location.pathname.split("/")[2] || Math.floor(Math.random() * 10000)
let D = []
let A = []
let _data = []
let A_data = []
let Xdata = [];
let Ydata = [];
let max = 200;
let step = 22;
for (let i = 0; i < 128; i++) 
{
    Ydata.push(i * 39)
}
let data = [];
// 如果建立连接
socket.onopen = function () 
{
    let data = JSON.stringify({
        equipmentId: equipmentId
    })
    socket.send(data)
}
// 监听接收数据
socket.onmessage = function (msg) 
{
    try {
        let data = JSON.parse(msg.data)
        D = data.value.splice(0, data.value.length)
        A = D



        let xL = microphoneoption.xAxis.data.length
        if (xL == step && _data.length>step*128) 
        {
            _data = _data.filter(item => item[0] > 0);
            _data = _data.map(function (item)
             {
                return [item[0] - 1, item[1], item[2]];
            })
        }
        for (let i=0; i<128; i++) 
        {
            _data.push([xL, parseInt(i), D[i]])
            // Ydata.push((parseInt(i) + 1) * 50)
        }
        microphoneoption.xAxis.data.push(data.time)
        if (microphoneoption.xAxis.data.length > step) 
        {
            microphoneoption.xAxis.data.shift()
        }
        microphoneoption.series[0].data = _data
        microphoneChart.setOption(microphoneoption)
        
        let xxL = accelerationoption.xAxis.data.length
        if (xxL == step && A_data.length > step*128) 
        {
            
            A_data = A_data.filter(item => item[0] > 0);
            A_data = A_data.map(function (item)
             {
                return [item[0] - 1, item[1], item[2]];
            })
        }
        for (let i=0; i<128; i++) 
        { 
            A_data.push([xxL, parseInt(i), Math.ceil(Math.random()*15)])
        }
        if (accelerationoption.xAxis.data.length > step) 
        {
            accelerationoption.xAxis.data.shift()
        }
        accelerationoption.series[0].data = A_data
        accelerationChart.setOption(accelerationoption)
    } catch (error) {}
}
socket.onclose = function () {}
socket.onerror = function () {}
let microphoneChart = echarts.init(document.getElementById('microphone'));
let accelerationChart = echarts.init(document.getElementById('acceleration'));


data = data.map(function (item) {
    return [item[1], item[0], item[2] || '-'];
});



// microphone图表的配置项和数据
microphoneoption = {
    tooltip: {
        position: 'top'
    },
    animation: true,
    grid: {
        height: '73%',
        top: '10%',
        bottom: '10%',
        left: '6%',
    },
    xAxis: {
        show: false,
        type: 'category',
        data: Xdata,
        max: step,
        splitArea: {
            show: true
        },
        axisLabel: {
            show: true,
        }
    },
    yAxis: {
        type: 'category',
        data: Ydata,
        splitArea: {
            show: true
        },
        axisLabel: {
            show: true,
        }

    },
    visualMap: {
        min: 0,
        max: max,
        calculable: false,
        orient: 'vertical',
        bottom: '14%',
        right: '3%',
        inRange: {                
            color: ['#FFF','#6CA6CD']
            }
    },
    series: [{
        name: 'Value',
        type: 'heatmap',
        data: data,
        smooth: true,
        label: {
            show: false
        },
        emphasis: {
            itemStyle: {
                shadowBlur: 1,
                shadowColor: 'rgba(150, 255, 0, 0.5)'
            }
        }

    }]
};


// microphone图表的配置项和数据
accelerationoption = {
    tooltip: {
        position: 'top'
    },
    animation: true,
    grid: {
        height: '73%',
        top: '10%',
        bottom: '10%',
        left: '6%',
    },
    xAxis: {
        show: false,
        type: 'category',
        data: Xdata,
        max: step,
        splitArea: {
            show: true
        },
        axisLabel: {
            show: true,
        }
    },
    yAxis: {
        type: 'category',
        data: Ydata,
        splitArea: {
            show: true
        },
        axisLabel: {
            show: true,
        }

    },
    visualMap: {
        min: 0,
        max: max,
        calculable: false,
        orient: 'vertical',
        bottom: '14%',
        right: '3%',
        inRange: {                
            color: ['#FFF','#FFA500']
            }
    },
    series: [{
        name: 'Value',
        type: 'heatmap',
        data: data,
        smooth: true,
        label: {
            show: false
        },
        emphasis: {
            itemStyle: {
                shadowBlur: 1,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }

    }]
};
// 使用刚指定的配置项和数据显示图表。
microphoneChart.setOption(microphoneoption);
accelerationChart.setOption(accelerationoption);