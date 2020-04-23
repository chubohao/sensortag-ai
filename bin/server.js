// 导入net模块:
const net = require('net')
const PORT = "9003"
const equipmentArray = []
const TIMEOUT = 10 * 1000; // 10秒没接收到数据就断开连接
const tcpClient = require('./client.js')
const websocket = require('./websocket')

//创建服务器对象
const server = net.createServer((socket) => {
    //connect
    let addr = socket.address().address + ':' + socket.remotePort
    console.log(addr, " connected.")

    // receive data
    socket.on("data", data => {
        data = data.toString('utf-8')
        let _c = []
        for(let i=0; i<data.length; i+=5){
            let item = data.slice(i,i+5)
            _c.push(parseInt(item))
        }
        websocket.sendData(_c)
    })

    // close
    socket.on('close', () => {
        console.log(addr, socket.id, "close")
    })
    socket.on('error', () => {
        console.log(addr, socket.id, "error")
    })
    socket.setTimeout(TIMEOUT);
    // 超过一定时间 没接收到数据，就主动断开连接。
    socket.on('timeout', () => {
        socket.end();
    });

})
server.on("error", (err) => {
    console.log(err)
})

//on监听
server.listen({
    port: PORT,
    host: '0.0.0.0'
}, () => {
    console.log('demo1 tcp server running on', server.address())
    setTimeout(() => {
        tcpClient.init()
    }, 4000);
})