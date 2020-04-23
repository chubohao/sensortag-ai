const net = require('net');

let client = new net.Socket();

function init() {
    client.connect(9003, '127.0.0.1', function () {
        console.log('tcp-client Connected.');
    });

    client.on('data', function (data) {
        console.log('tcp-client received: ' + data);
    });

    client.on('close', function () {
        console.log('Connection closed.');
    });

    client.on('error', (err) => {
        console.error(err)
    })


}

module.exports = {
    init: init
}