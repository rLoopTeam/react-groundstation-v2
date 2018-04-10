/*
* Groundstation backend
*-----------------------
*/
const commConfig = require('../config/commConfig');
const app = require('./app');

/* ------------
    SERVER
  Serves up the client http files
------------ */
const PORT = process.env.PORT || commConfig.Appserver.port;
const env = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT + '!');
});

const io = require('socket.io')(server);

var room = {
  dataLogging: 'dataLogging',
  commConfig: 'commConfig',
  hoverEngines: 'hoverEngines'
};
/* ------------
  grpc client that will communicate with the main groundstation backend
------------ */

//const grpc = require('./grpc/client');

/* ------------
  RTDATASTORE
  Holds the last parameter values received from the pod.
  Queried by the stream pipe server for data to send to the client
------------ */
// TODO pass a hook to connect the UDP rx with the real time data store,
// TODO pass or return a hook to give the stream pipe server access to this data store
var rtDataStore = require('./realtimeDataStore')();

/* ------------
  Stats on packets for various things that get added back to the rtDataStore
------------ */
var packetStats = require('./udp/packetStats.js')(rtDataStore);

/* ------------
    Stream Pipe
  Sits between the data store and the client.
  Sends requested parameters to the client at a fixed interval.
------------ */
const StreamPipeServer = require('./StreamPipeServer.js')(io, rtDataStore);

/* -----------
  Put the UDP RX in it's own process
------------ */
const cp = require('child_process');

// added "[], {execArgv: ['--debug=5859']}" becuase this was blocking the debugger by using the 5858 port
// found this fix here: https://github.com/nodejs/node/issues/3469
const udpMain = cp.fork('./server/grpc/client.js', [], {execArgv: ['--inspect=5859']});
udpMain.on('message', (message) => {
  console.log("ON MESSAGE: " + message.Command);
  if (message.Command === "newPacket") {
    rtDataStore.insertDataPacket(message.Data);
    //packetStats.gotPacketType(m.data.packetType, m.data.crc, m.data.sequence, m.data.node);
  }else if(message.Command === "serverInfo"){
    rtDataStore.updateServerStats(message.Data)
  }
});

/* ------------
  All UDP I/O directly to/from pod.
  ***commands to the pod are currently down in websocketCommands, that should be abstracted out to here.
------------ */
var podCommands = require('./udp/podCommands')(udpMain);

/* ------------
 Config module
 Saves the config settings
 ------------ */
const config = require('./config.js')(packetStats);

// Scans the temperature node sensor busses
// for the temperature sensor ROM Ids
var romIDScanner = require('./ROMIDScanner.js')(podCommands, rtDataStore);

/* ------------
  Grabs data from the charger
------------ */
var charger = require('./charger')(rtDataStore);

/* ------------
  WEBSOCKETS
  Handles commands from the client to send to the Pod.
------------ */
const websocketCommands = require('./websocketCommands.js')(io, room, podCommands, commConfig, config, romIDScanner, charger);

/* -----------
  GUI Preload
  Let the GUI load up in a nicer state
  */
const GUIPreload = require('./preloadGUI.js');
//GUIPreload();
