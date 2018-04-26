const PROTO_PATH = __dirname + '/proto/groundstation.proto';
const impl = require('./clientImpl');
const util = require('util');

const grpc = require('grpc');
const protoClient = grpc.load(PROTO_PATH).proto;

class GrpcClient {
  constructor() {
    process.on('message', function (m) {
      switch (m.Command) {
        case "connect": this.createConnection(m.Data);
          break;
        case "transmitPodCommand": this.transmitPodCommand(m.Data);
          break;
        case "streamPackets": this.streamPackets();
          break;
        case "stopStream": this.stopStream();
          break;
        case "serverControl": this.sendControl(m.Data);
          break;
        case "getServerStatus": ;
          break;
      }

    }.bind(this));

    setInterval(this.heartBeat.bind(this), 1000);
    this.grpcServerAddress = "";
    this.client = undefined;
  }

  heartBeat(){
    if(this.isConnected()){
      impl.ping(this.client,this.sendServerStatus.bind(this));
    }else {
      this.sendServerStatus(0);
    }
  }

  transmitPodCommand(Data){
    if(!this.isConnected()){
      this.createConnection("localhost:9800");
    }
    this._transmitPodCommand(Data);
  }

  streamPackets(){
    if(!this.isConnected()){
      console.log("IS NOT CONNECTED TO GRPC");
      this.createConnection("localhost:9800");
    }
    this._streamPackets();
  }

  stopStream(){
    if (this.currentStream !== undefined){
      this.currentStream.cancel();
    }
  }

  sendControl(data){
    if(this.isConnected()){
      impl.sendControl(client,data);
    }
  }

  sendServerStatus(status){
    //console.log(util.inspect(status, {depth: null}));
    let data0,data1,data2,data3,data4,data5 = {ParameterName: '', Value: ''};
    let dataArray = [];
    if (status !== null){
      data0 = {
        ParameterName: 'GrpcServerEndPoint',
        Value: this.grpcServerAddress
      };
      data1 = {
        ParameterName: 'GrpcServerStatus',
        Value: 2
      };
      data2 = {
        ParameterName: 'DataStoreManagerRunning',
        Value: status['DataStoreManagerRunning']
      };
      data3 = {
        ParameterName: 'GRPCServerRunning',
        Value: status['GRPCServerRunning']
      };
      data4 = {
        ParameterName: 'BroadcasterRunning',
        Value: status['BroadcasterRunning']
      };
      data5 = {
        ParameterName: 'GSLoggerRunning',
        Value: status['GSLoggerRunning']
      };
      dataArray = [data0,data1,data2,data3,data4,data5]
    }
    console.log("sending server info");

    process.send({Command: "serverInfo", Data:dataArray});
  }

  sendProtoToDatastore(data) {
    this.sendServerStatus(2);
    process.send({Command: "newPacket", Data: data});
  };

  createConnection(address){
    if(this.isConnected()){
      this.client.close();
    }
    this.grpcServerAddress = address;
    console.log("CREATING GRPC CLIENT WITH ADDRESS: " + address);
    this.client = new protoClient.GroundStationService(address, grpc.credentials.createInsecure());
    console.log(util.inspect(this.client, {depth: null}));
  }

  isConnected(){
    return (this.client != null && this.client !== undefined);
  }

  _streamPackets(){
    this.currentStream = impl.streamPackets(this.client, this.sendProtoToDatastore.bind(this), this.sendServerStatus.bind(this));
  }

  _transmitPodCommand(Data){
    //console.log("transmit pod command: ");
    //console.log(util.inspect(Data, {depth: null}));
    impl.sendCommand(this.client,Data.Node,Data.CommandType,Data.data0, Data.data1, Data.data2, Data.data3)
  }
}

let newClient = new GrpcClient();

module.exports = newClient;
