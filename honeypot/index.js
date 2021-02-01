var net = require('net');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./bot_samples.db');
var serviceHeaders = require('./serviceHeaders.json');
var config = require('./config.json');

function matchPortConfig(port, config) {
    return config.port == port
}

function matchServiceFilter(keyword, service) {
    return service.name.includes(keyword)
}

function connHandler(socket) {
    //Gets an array of keywords associated with listening port for socket
    var keywordsOfPort = config.listeners.filter(matchPortConfig.bind(this, socket.localPort));
    var keywordsOfPort = keywordsOfPort[0]['keywords'];
    //Picks a random keyword from that set
    var randomKeyword = keywordsOfPort[Math.floor(Math.random() * keywordsOfPort.length)];
    //Gets an array of serviceHeaders associated with that keyword
    var matchedKeywordServiceHeaders = serviceHeaders.filter(matchServiceFilter.bind(this, randomKeyword));
    //Picks a random service header from that set
    var randomServiceHeader = matchedKeywordServiceHeaders[Math.floor(Math.random() * matchedKeywordServiceHeaders.length)]['header'];

    //Log
    console.log('SERVICE_HEADER', socket.localPort, '==>', socket.remoteAddress, ': ', randomServiceHeader);
    //Pipe though the socket
    socket.write(randomServiceHeader);
    //Read data back from client
    socket.on('data', function (data) {
        console.log('CLIENT_DATA', socket.localPort, '<==', socket.remoteAddress, ': ', data, typeof data, "===", typeof "exit");
        if (data === "exit") console.log('exit message received !');

        var epoch = Date.now();
        db.run(`INSERT INTO logs(unixepoch, srcIp, destPort, serviceHeader, data) VALUES(?,?,?,?,?)`,
            [epoch, socket.remoteAddress, socket.localPort, randomServiceHeader, data],
            function (err) {
                if (err) {
                    return console.log(err.message);
                }
                // get the last insert id
                console.log(`A row has been inserted with rowid ${this.lastID}`);
            });
    });
    socket.on('end', function () {
        console.log('CLIENT_CLOSE', '<==', socket.remoteAddress);
    });

    socket.on('error', function (error) {
        console.log('error');
    });
}

// function shipLogs(){
//     var epoch = Date.now();
//     db.get(`SELECT * FROM lastShipped`, function(row){
//         //Logs have never shipped
//         if(row == null){

//         }
//         //Ship logs created since last date
//         else{

//         }
//     })
// }

//Set up Listeners
for (i = 0; i < config.listeners.length; i++) {
    console.log('Starting listener on port', config.listeners[i].port, 'with keywords', config.listeners[i].keywords);
    net.createServer(connHandler).listen(config.listeners[i].port);
}
//Ship Logs to collector every 3s
//setInterval(shipLogs, 3000);
