const grpc = require('grpc');
const util = require('util');

module.exports = {
  streamPackets: function(client,callback, connectionStatusCallback){
      const call = client.streamPackets();
      console.log("stream requested");
      //console.log(util.inspect(call, {depth: null}));
      call.on('error', function(error){
        console.error(error)
      });
      //call.on('cancelled',connectionStatusCallback);
      call.on('status', connectionStatusCallback);
      call.on('data',callback);
      return call;
  },
  sendCommand: function(client, node, type, data0, data1, data2, data3){
    let command = {
      Node: node,
      PacketType: type,
      Data: [data0, data1, data2, data3]
    };

    for (let idx = 0; idx < command.Data.length; idx++){
      if (command.Data[idx] === undefined){
        command.Data[idx] = 0;
      }
    }
    //console.log(util.inspect(command, {depth: null}));
    try{
      const call = client.sendCommand(command, function (err,response){
        if(err){
          console.log("ERROR CALLBACK:");
        }else{
          console.log("command succesfuly sent");
        }

      });
    }catch(err){
      console.error("CATCH ERROR: " + err);
    }

    /*call.on('error', function(error){
      console.error(error);
    })*/
  },

  sendControl: function (client,data) {
    try{
      const call = client.controlServer({Command:data},function (err,response) {
        if(err){
          console.log("ERROR CONTROL SERVER" + err);
        }
      })
    }catch (err){

    }
  },
  ping: function(client,callback){
    try{
      const call = client.ping({}, function (err,response){
        console.log("PING!");
        if(err){
          console.log("ERROR PING");
          callback(null);
        }else{
          callback(response['Status']);
        }
      });
    }catch(err){
      console.error("CATCH ERROR: " + err);
    }
  }
};
