const events = require('events');
const util = require('util');

class RealTimeDataStore {
  constructor () {
    this.hasNewData = new events.EventEmitter();
    this.date = new Date();

    /* ---------
    Data Store Structure:
      [{'PacketName':'Accel 2 Packet',
        'RxTime':'', Linux time in millis
        'Name':'',
        'Value':'',
        'Units':'',
      }
       .....
      ]
    ----------
    */
    //two-dimensional array
    //first array contains the datastore,
    //second array contains the GS backend server status
    this.rtDataStore = [[],[]];
    this.lookupMap = new Map();
    this.insertDataPacket = this.insertDataPacket.bind(this);
  }

  /* -------
  newDataPacket format:
  {
    packetName
    packetType
    rxTime (millis)
    paramaters [
      name
      value
      units
    ]
  }
  ---------
  */

  updateServerStats(newData){
    const length = newData.length;
    const bundle = [];
    for (let idx = 0; idx < length; idx++){
      //console.log("server status: " + newData[idx].ParameterName + 'Value: ' + newData[idx].Value);
      const dataUnit = {'PacketName': '',
        'RxTime': Date.now(),
        'Name': newData[idx].ParameterName,
        'Value': newData[idx].Value,
        'Units': ''
      };
      bundle.push(dataUnit);
    }

    const bundleSize = bundle.length;

    for (let idx = 0; idx < bundleSize; idx++){
      let dataStore_idx = this.lookupMap.get(bundle[idx].Name);
      if (dataStore_idx === undefined){
        dataStore_idx = {x:1,y:(this.rtDataStore[1].push(bundle[idx])) - 1};
        this.lookupMap.set(bundle[idx].Name,dataStore_idx);
      }else{
        this.rtDataStore[dataStore_idx.x][dataStore_idx.y] = bundle[idx];
      }
    }
  }

  insertDataPacket (newDataBundle) {
    this.hasNewData.emit('new_rtData', newDataBundle);
    const parameters = newDataBundle.Parameters;
    const bundleSize = parameters.length;
    for (let idx = 0; idx < bundleSize; idx++){
      let value = 0;
      switch (parameters[idx].Value.Index) {
        case 1: value = parameters[idx].Value.Int64Value;
          break;
        case 2: value = parameters[idx].Value.Uint64Value;
          break;
        case 3: value = parameters[idx].Value.DoubleValue;
          break;
      }
      const dataUnit = {'PacketName': parameters[idx].PacketName,
        'RxTime': parameters[idx].RxTime,
        'Name': parameters[idx].ParamName,
        'Value': value,
        'Units': parameters[idx].Units
      };
      let dataStore_idx = this.lookupMap.get(parameters[idx].ParamName);
      if (dataStore_idx === undefined){
        dataStore_idx = {x:0,y:(this.rtDataStore[0].push(dataUnit)) - 1};
        this.lookupMap.set(parameters[idx].ParamName,dataStore_idx);
      }else{
        this.rtDataStore[dataStore_idx.x][dataStore_idx.y] = dataUnit;
      }
    }
  }

  retrieveDataParameter (parameterName) {
    let ret = {'Name': parameterName,
      'Value': '?',
      'IsStale': true,
      'Units': '',
      'PacketName': '?'};
    const idx = this.lookupMap.get(parameterName);
    if (idx !== undefined){
      ret = this.rtDataStore[idx.x][idx.y];
      //ret.IsStale = (Date.now() - ret.RxTime) > 2000;
    }
    //console.log("REQUESTED: " + ret.Name + " VALUE: " + ret.Value);
    return ret;
  }
}

module.exports = function () {
  return new RealTimeDataStore();
};
