const bin = require('./binary');
var chalk = require('chalk');// using this to show messages in color

const allowDangerousCommands = process.env.RLOOP_DANGER === 'I_KNOW_WHAT_I_AM_DOING';

module.exports = function (grpc) {
  // flag allow/disallow the use of FCUBrake_MoveMotorRAW which is
  // extreamly dangerous and will damage the magnets

  var _brakeDevelopmentConfirmation = false;

  function GS_Heartbeat () {
    transmitPodCommand('Flight Control', 0x0400, 0x0, 0x0, 0x0, 0x0);
  }

  function Pwr_Heartbeat () {
    transmitPodCommand('Power Node A', 0x3FFF, 0x1234ABCD, 0x0, 0x0, 0x0);
    transmitPodCommand('Power Node B', 0x3FFF, 0x1234ABCD, 0x0, 0x0, 0x0);
  }

  function LGU_PositionChange (liftName, liftDirection) {
    console.log('Name:' + liftName + ' Direction:' + liftDirection);
    // transmitPodCommand('????', 0x0000, 0x000000, 0x0, 0x0, 0x0) //TODO
  }

  function LGU_SpeedChange (liftName, liftSpeed) {
    console.log('Name:' + liftName + ' Speed:' + liftSpeed);
    // transmitPodCommand('????', 0x0000, 0x000000, 0x0, 0x0, 0x0) //TODO
  }

  function setBrakeDevelopmentMode (value) {
    console.log('podcommands: set eddv mode', value);
    // this is used as a flag to allow/disallow the use of FCUBrake_MoveMotorRAW which is
    // extreamly dangerous and will damage the magnets

    _brakeDevelopmentConfirmation = value;
  }

  /**
   * Pod Safe
   */
  function FCUPod_Off () {
    transmitPodCommand('Flight Control', 0x3000, 0x76543210, 0x0, 0x0, 0x0);
  }

  function FCUPod_Stop () {
    transmitPodCommand('Flight Control', 0x0001, 0x1234ABCD, 0x0, 0x0, 0x0);
  }

  /**
   *
   * Power Latch
   * @param {any} data - data.powerNode (0 or 1) for Power Node A or Power Node B
   */
  function FCUPod_PowerLatch (data) {
    transmitPodCommand('Flight Control', 0x3030, 0xABCD1245, data.powerNode, 0x0, 0x0);
  }

  function FCUBrake_DisableDevelopmentMode () {
    this.setBrakeDevelopmentMode(false);
    // using 0x000000 value to disable development mode (any value other than 0x01293847 will disable this setting)
    transmitPodCommand('Flight Control', 0x1400, 0x000000, 0x0, 0x0, 0x0);
  }

  /**
   * THIS IS VERY VERY DANGEROUS
   */
  function FCUBrake_EnableDevelopmentMode () {
    if (allowDangerousCommands) {
      console.warn('Brake development mode has been enabled. This is dangerous and will damage the magnets.');
      transmitPodCommand('Flight Control', 0x0100, 0x00000001, 0x00001003, 0x0, 0x0);
      this.setBrakeDevelopmentMode(true);
    } else {
      console.warn('Brake development mode request denied. Please rerun the ground station with environ ' +
                  'RLOOP_DANGER=I_KNOW_WHAT_I_AM_DOING');
    }
  }

  /**
   * THIS IS VERY VERY DANGEROUS
   * data.command (0 = Left, 1 = Right, 2 = Both)
   * data.position (microns)
   */
  function FCUBrake_MoveMotorRAW (data) {
    console.log('move motor raw ', data);

    if (_brakeDevelopmentConfirmation) {
      transmitPodCommand('Flight Control', 0x1401, data.command, data.position, 0x0, 0x0);
    }
  }

  function FCUBrake_MoveMotorIBeam (data) {
    console.log('move motor i-beam', data);
    // THIS IS VERY VERY DANGEROUS
    // data.position (mm)

    if (_brakeDevelopmentConfirmation) {
      // sending floats in annoying but this is how to do it
      var bytes = bin.float32ToBytes(data.position);
      transmitPodCommand('Flight Control', 0x1403, bin.bytesToUint32(bytes[0], bytes[1], bytes[2], bytes[3], false), 0x0, 0x0, 0x0);
    }
  }

  function FCUBrake_BeginInit (data) {
    console.log('Brakes: Begin Init', data);
            // THIS IS VERY VERY DANGEROUS

    if (_brakeDevelopmentConfirmation) {
      transmitPodCommand('Flight Control', 0x1408, 0x98765432, 0x0, 0x0, 0x0);
    }
  }

  function FCUBrake_MLPSetZeroLeftBrake () {
    console.log('Brakes: Set Zero Left Brake');
            // THIS IS VERY VERY DANGEROUS

    if (_brakeDevelopmentConfirmation) {
      transmitPodCommand('Flight Control', 0x1409, 0x55660123, 0x0, 0x0, 0x0);
    }
  }

  function FCUBrake_MLPSetZeroRightBrake () {
    console.log('Brakes: Set Zero Right Brake');
            // THIS IS VERY VERY DANGEROUS

    if (_brakeDevelopmentConfirmation) {
      transmitPodCommand('Flight Control', 0x1409, 0x55660123, 0x01, 0x0, 0x0);
    }
  }

  function FCUBrake_MLPSetSpanLeftBrake () {
    console.log('Brakes: Set Span Left Brake');
            // THIS IS VERY VERY DANGEROUS

    if (_brakeDevelopmentConfirmation) {
      transmitPodCommand('Flight Control', 0x1409, 0x55660123, 0x0, 0x1, 0x0);
    }
  }

  function FCUBrake_MLPSetSpanRightBrake () {
    console.log('Brakes: Set Span Right Brake');
    // THIS IS VERY VERY DANGEROUS

    if (_brakeDevelopmentConfirmation) {
      transmitPodCommand('Flight Control', 0x1409, 0x55660123, 0x01, 0x1, 0x0);
    }
  }

  function FCUStepper_SetMaxAngularAccel (data) {
            // data.brake 0 = Left, 1 = right
            // data.value

    console.log('Setting Max Angular Accel');
    transmitPodCommand('Flight Control', 0x1404, 0x0, data.brake, data.value, 0x0);
  }

  function FCUStepper_SetPicoMetersPerRev (data) {
            // data.brake 0 = Left, 1 = right
            // data.value

    console.log('Setting Picometers per revolution');
    transmitPodCommand('Flight Control', 0x1404, 0x1, data.brake, data.value, 0x0);
  }

  function FCUStepper_SetMaxRPM (data) {
            // data.brake 0 = Left, 1 = right
            // data.value

    console.log('Setting MAX RPM');
    transmitPodCommand('Flight Control', 0x1404, 0x2, data.brake, data.value, 0x0);
  }

  function FCUStepper_SetMicroStepResolution (data) {
            // data.brake 0 = Left, 1 = right
            // data.value

    console.log('Setting Micro Step Resolution');
    transmitPodCommand('Flight Control', 0x1404, 0x3, data.brake, data.value, 0x0);
  }

  function FCUStreamingControlStart_AccelCalData () {
    transmitPodCommand('Flight Control', 0x0100, 0x00000001, 0x00001001, 0x0, 0x0);
  }

  function FCUStreamingControlStart_AccelFullData () {
    transmitPodCommand('Flight Control', 0x0100, 0x00000001, 0x00001003, 0x0, 0x0);
  }

  function FCUStreamingControlStart_Lasers () {
    transmitPodCommand('Flight Control', 0x0100, 0x00000001, 0x00001101, 0x0, 0x0);
  }

  function FCUStreamingControlStart_ForwardLaser () {
    transmitPodCommand('Flight Control', 0x0100, 0x00000001, 0x00001201, 0x0, 0x0);
  }

  function FCUStreamingControlStop_Accel () {
    transmitPodCommand('Flight Control', 0x0100, 0x00000000, 0x00000000, 0x0, 0x0);
  }

  function FCUStreamingControlStart_Brakes () {
    transmitPodCommand('Flight Control', 0x0100, 0x01, 0x1402, 0x0, 0x0);
  }

  function FCUStreamingControlStart_MotorsRaw () {
    transmitPodCommand('Flight Control', 0x0100, 0x01, 0x1406, 0x0, 0x0);
  }

    // Accel control
  function FCUAccel_FineZero (data) {
    transmitPodCommand('Flight Control', 0x1005, data.accel, data.axis, 0x0, 0x0);
  }
  function FCUAccel_AutoZero (data) {
    transmitPodCommand('Flight Control', 0x1004, data.accel, 0x00000000, 0x0, 0x0);
  }

    // contrast sensors
  function FCUContrast_StartStream () {
    transmitPodCommand('Flight Control', 0x0100, 0x01, 0x1301, 0x0, 0x0);
  }
  function FCUContrast_StopStream () {
    transmitPodCommand('Flight Control', 0x0100, 0x00, 0x00000000, 0x0, 0x0);
  }

  function PowerAStreamingOff () {
    transmitPodCommand('Power Node A', 0x3010, 0x00, 0x00000000, 0x0, 0x0);
  }

  function PowerBStreamingOff () {
    transmitPodCommand('Power Node B', 0x3010, 0x00, 0x00000000, 0x0, 0x0);
  }

  function PowerARequestBMS () {
    transmitPodCommand('Power Node A', 0x3010, 0x01, 0x3401, 0x0, 0x0);
  }

  function PowerBRequestBMS () {
    transmitPodCommand('Power Node B', 0x3010, 0x01, 0x3401, 0x0, 0x0);
  }

  function PowerARequestCooling () {
    transmitPodCommand('Power Node A', 0x3600, 0x0, 0x0, 0x0, 0x0);
  }

  function PowerAStartCooling () {
    transmitPodCommand('Power Node A', 0x3041, 0x1, 0x0, 0x0, 0x0);
  }

  function PowerBRequestCooling () {
    transmitPodCommand('Power Node B', 0x3010, 0x01, 0x3601, 0x0, 0x0);
  }

  function PowerBStartCooling () {
    transmitPodCommand('Power Node B', 0x3041, 0x1, 0x0, 0x0, 0x0);
  }

  function PowerAStartRepressurizing () {
    transmitPodCommand('Power Node A', 0x3040, 0x1, 0x0, 0x0, 0x0);
  }

  function PowerBStartRepressurizing () {
    transmitPodCommand('Power Node B', 0x3040, 0x1, 0x0, 0x0, 0x0);
  }

  function PowerATestSolenoidPin4 () {
    transmitPodCommand('Power Node A', 0x3602, 0x0, 0x0, 0x0, 0x0);
  }

  function PowerATestSolenoidPin8 () {
    transmitPodCommand('Power Node A', 0x3603, 0x0, 0x0, 0x0, 0x0);
  }

  function PowerATestSolenoidPin16 () {
    transmitPodCommand('Power Node A', 0x3604, 0x0, 0x0, 0x0, 0x0);
  }

  function PowerATestSolenoidPin22 () {
    transmitPodCommand('Power Node A', 0x3605, 0x0, 0x0, 0x0, 0x0);
  }

  function PowerATestSolenoidPin23 () {
    transmitPodCommand('Power Node A', 0x3606, 0x0, 0x0, 0x0, 0x0);
  }

  function PowerBTestSolenoidPin4 () {
    transmitPodCommand('Power Node B', 0x3602, 0x0, 0x0, 0x0, 0x0);
  }

  function PowerBTestSolenoidPin8 () {
    transmitPodCommand('Power Node B', 0x3603, 0x0, 0x0, 0x0, 0x0);
  }

  function PowerBTestSolenoidPin16 () {
    transmitPodCommand('Power Node B', 0x3604, 0x0, 0x0, 0x0, 0x0);
  }

  function PowerBTestSolenoidPin22 () {
    transmitPodCommand('Power Node B', 0x3605, 0x0, 0x0, 0x0, 0x0);
  }

  function PowerBTestSolenoidPin23 () {
    transmitPodCommand('Power Node B', 0x3606, 0x0, 0x0, 0x0, 0x0);
  }

  function PowerAChargeRelayOff () {
    transmitPodCommand('Power Node A', 0x3100, 0x00, 0x00000000, 0x0, 0x0);
  }

  function PowerAChargeRelayOn () {
    transmitPodCommand('Power Node A', 0x3100, 0x01, 0x00000000, 0x0, 0x0);
  }

  function PowerAStreamCurrentTemps () {
    transmitPodCommand('Power Node A', 0x3010, 0x01, 0x3201, 0x0, 0x0);
  }

  function PowerBStreamCurrentTemps () {
    transmitPodCommand('Power Node B', 0x3010, 0x01, 0x3201, 0x0, 0x0);
  }

  function PowerAStreamTempLocations () {
    transmitPodCommand('Power Node A', 0x3010, 0x01, 0x3203, 0x0, 0x0);
  }

  function PowerBStreamTempLocations () {
    transmitPodCommand('Power Node B', 0x3010, 0x01, 0x3203, 0x0, 0x0);
  }

  function PowerARequestRomID (data) {
    transmitPodCommand('Power Node A', 0x3204, data, 0x0, 0x0, 0x0);
  }

  function PowerBRequestRomID (data) {
    transmitPodCommand('Power Node B', 0x3204, data, 0x0, 0x0, 0x0);
  }

  function PowerAStartCharging () {
    transmitPodCommand('Power Node A', 0x3020, 0x11229988, 0x01, 0x0, 0x0);
  }

  function PowerAStopCharging () {
    transmitPodCommand('Power Node A', 0x3020, 0x11229988, 0x0, 0x0, 0x0);
  }

  function PowerBStartCharging () {
    transmitPodCommand('Power Node B', 0x3020, 0x11229988, 0x01, 0x0, 0x0);
  }

  function PowerBStopCharging () {
    transmitPodCommand('Power Node B', 0x3020, 0x11229988, 0x0, 0x0, 0x0);
  }

  function PowerAStopAllManualDischarging () {
    transmitPodCommand('Power Node A', 0x3021, 0x34566543, 0x0, 0, 0x0);
  }

  function PowerBStopAllManualDischarging () {
    transmitPodCommand('Power Node B', 0x3021, 0x34566543, 0x0, 0, 0x0);
  }

  function PowerAStartDischarging (data) {
    transmitPodCommand('Power Node A', 0x3021, 0x34566543, 0x1, data.cellIndex, 0x1);
  }

  function PowerAStopDischarging (data) {
    transmitPodCommand('Power Node A', 0x3021, 0x34566543, 0x1, data.cellIndex, 0x0);
  }

  function PowerBStartDischarging (data) {
    transmitPodCommand('Power Node B', 0x3021, 0x34566543, 0x1, data.cellIndex, 0x1);
  }

  function PowerBStopDischarging (data) {
    transmitPodCommand('Power Node B', 0x3021, 0x34566543, 0x1, data.cellIndex, 0x0);
  }

  function PowerAPowerLatch () {
    transmitPodCommand('Power Node A', 0x3030, 0xABCD1245, 0x0, 0x0, 0x0);
  }

  function PowerBPowerLatch () {
    transmitPodCommand('Power Node B', 0x3030, 0xABCD1245, 0x1, 0x0, 0x0);
  }

  function PowerAToPowerB () {
    transmitPodCommand('Power Node A', 0x3031, 0x11223344, 0x1, 0, 0x0);
  }

  function PowerBToPowerA () {
    transmitPodCommand('Power Node B', 0x3031, 0x11223344, 0x0, 0, 0x0);
  }

  // Hover Engines
  function FCUHover_Enable () {
    transmitPodCommand('Flight Control', 0x0000, 0x00, 0x00000000, 0x0, 0x0); // TODO
  }

  function FCUHover_Disable () {
    transmitPodCommand('Flight Control', 0x0000, 0x00, 0x00000000, 0x0, 0x0); // TODO
  }

  function FCUHover_EnableStaticHovering () {
    transmitPodCommand('Flight Control', 0x0000, 0x00, 0x00000000, 0x0, 0x0); // TODO
  }

  function FCUHover_ReleaseStaticHovering () {
    transmitPodCommand('Flight Control', 0x0000, 0x00, 0x00000000, 0x0, 0x0); // TODO
  }

  function FCUHover_EnableHEX (hexName) {
    transmitPodCommand('Flight Control', 0x0000, 0x00, 0x00000000, 0x0, 0x0); // TODO
  }

  function FCUHover_DisableHEX (hexName) {
    transmitPodCommand('Flight Control', 0x0000, 0x00, 0x00000000, 0x0, 0x0); // TODO
  }
  function FCUHover_SetHEXSpeed (hexName, hexSpeed) {
    transmitPodCommand('Flight Control', 0x0000, 0x00, 0x00000000, 0x0, 0x0); // TODO
  }

  function FCUHover_StartCooling (coolingName) {
    transmitPodCommand('Flight Control', 0x0000, 0x00, 0x00000000, 0x0, 0x0); // TODO
  }

  function FCUHover_StopCooling (coolingName) {
    transmitPodCommand('Flight Control', 0x0000, 0x00, 0x00000000, 0x0, 0x0); // TODO
  }

  function FCUHover_OpenSolenoid (solenoidName) {
    transmitPodCommand('Flight Control', 0x0000, 0x00, 0x00000000, 0x0, 0x0); // TODO
  }

    // Aux Propulsion
  function FCUAuxProp_Enable () {
    transmitPodCommand('Flight Control', 0x0000, 0x00, 0x00000000, 0x0, 0x0); // TODO
  }
  function FCUAuxProp_Disable () {
    transmitPodCommand('Flight Control', 0x0000, 0x00, 0x00000000, 0x0, 0x0); // TODO
  }
  function FCUAuxProp_SetSpeed (speed) {
    transmitPodCommand('Flight Control', 0x0000, 0x00, 0x00000000, 0x0, 0x0); // TODO
  }

        // Gimbal
  function FCUGimbal_Static () {
    transmitPodCommand('Flight Control', 0x0000, 0x00, 0x00000000, 0x0, 0x0); // TODO
  }
  function FCUGimbal_FullBackwards () {
    transmitPodCommand('Flight Control', 0x0000, 0x00, 0x00000000, 0x0, 0x0); // TODO
  }

  // HE Thermal Board

  function HETherm_ControlCooling (data) {
    transmitPodCommand('HE Thermal Monitor', 0x6002, 0xAA117788, data.solenoid, data.action, 0x0);
  }

  function HETherm_ControlMode (data) {
    transmitPodCommand('HE Thermal Monitor', 0x6002, 0xAA117799, data, 0x0, 0x0);
  }

  function XilinxSim_Start () {
    transmitPodCommand('Xilinx Sim', 0x5000, 0x1, 0x0, 0x0, 0x0);
  }
  function XilinxSim_Stop () {
    transmitPodCommand('Xilinx Sim', 0x5000, 0x0, 0x0, 0x0, 0x0);
  }
  function XilinxSim_Laser0On () {
    transmitPodCommand('Xilinx Sim', 0x5001, 0x0, 0x1, 0x0, 0x0);
  }
  function XilinxSim_Laser0Off () {
    transmitPodCommand('Xilinx Sim', 0x5001, 0x0, 0x0, 0x0, 0x0);
  }
  function XilinxSim_Laser1On () {
    transmitPodCommand('Xilinx Sim', 0x5001, 0x1, 0x1, 0x0, 0x0);
  }
  function XilinxSim_Laser1Off () {
    transmitPodCommand('Xilinx Sim', 0x5001, 0x1, 0x0, 0x0, 0x0);
  }
  function XilinxSim_Laser2On () {
    transmitPodCommand('Xilinx Sim', 0x5001, 0x2, 0x1, 0x0, 0x0);
  }
  function XilinxSim_Laser2Off () {
    transmitPodCommand('Xilinx Sim', 0x5001, 0x2, 0x0, 0x0, 0x0);
  }

  function AutoSequenceTest_Start () {
    transmitPodCommand('Xilinx Sim', 0x1900, 0x01, 0x0, 0x0, 0x0);
  }
  function AutoSequenceTest_Skip () {
    transmitPodCommand('Xilinx Sim', 0x1900, 0x02, 0x0, 0x0, 0x0);
  }
  function AutoSequenceTest_Kill () {
    transmitPodCommand('Xilinx Sim', 0x1900, 0x03, 0x0, 0x0, 0x0);
  }
  function AutoSequenceTest_Restart () {
    transmitPodCommand('Xilinx Sim', 0x1900, 0x04, 0x0, 0x0, 0x0);
  }

  function PodSafePowerNodeA () {
    transmitPodCommand('Power Node A', 0x3000, 0x76543210, 0x0, 0x0, 0x0);
  }

  function PodSafePowerNodeB () {
    transmitPodCommand('Power Node B', 0x3000, 0x76543210, 0x0, 0x0, 0x0);
  }

  function ForcePreRunPhase () {
    transmitPodCommand('Flight Control', 0x0003, 0x00000000, 0x0, 0x0, 0x0); // TODO need to set the correct 3rd parameter (block0 of the command packet)
  }

  function setChargerV (data) {
    transmitPodCommand('IPS Charger', 0x9123, 0x76543210, data.voltage, 0x0, 0x0);
  }

  function setChargerI (data) {
    transmitPodCommand('IPS Charger', 0x9124, 0x76543210, data.current, 0x0, 0x0);
  }

  function PySimControl (data){
    transmitPodCommand('Python Sim',0x0000, data[0],data[1],data[2],data[3])
  }

  function FCUGenPodCommand (data) {
    let key;

    if (data.action === 'unlock') {
      key = 0x4321FEDC;
    } else if (data.action === 'execute') {
      key = 0xDCBA9876;
    } else {
      throw new Error('Unlock or execute booleans not set in FCUGenPodCommand.');
    }

    transmitPodCommand('Flight Control', 0x0500, key, data.command, 0x0, 0x0);
  }

  function GrpcSetServer(data){
    grpc.send({Command:"connect",Data:data});
  }

  function GrpcStreamPackets(){
    grpc.send({Command:"streamPackets"});
  }

  function transmitPodCommand(node, commandType, data0, data1, data2, data3){
    data = {
      Node: node,
      CommandType: commandType,
      Data0: data0,
      Data1: data1,
      Data2: data2,
      Data3: data3
    };
    grpc.send({Command:"transmitPodCommand",Data:data})
  }

  function ServerControlLogServiceStart(){
    grpc.send({Command:"serverControl",Data:0})
  }

  function ServerControlLogServiceStop(){
    grpc.send({Command:"serverControl",Data:1})
  }

  function ServerControlDatastoreManagerStart(){
    grpc.send({Command:"serverControl",Data:2})
  }

  function ServerControlDatastoreManagerStop() {
    grpc.send({Command:"serverControl",Data:3})
  }

  function ServerControlBroadcasterStart() {
    grpc.send({Command:"serverControl",Data:4})
  }

  function ServerControlBroadcasterStop() {
    grpc.send({Command:"serverControl",Data:5})
  }

  return {
    GS_Heartbeat,
    Pwr_Heartbeat,

    LGU_PositionChange,
    LGU_SpeedChange,

    FCUPod_Off,
    FCUPod_Stop,
    FCUPod_PowerLatch,

    setBrakeDevelopmentMode,
    FCUBrake_DisableDevelopmentMode,
    FCUBrake_EnableDevelopmentMode,
    FCUBrake_MoveMotorRAW,
    FCUBrake_MoveMotorIBeam,
    FCUBrake_BeginInit,
    FCUBrake_MLPSetZeroLeftBrake,
    FCUBrake_MLPSetZeroRightBrake,
    FCUBrake_MLPSetSpanLeftBrake,
    FCUBrake_MLPSetSpanRightBrake,
    FCUStepper_SetMaxAngularAccel,
    FCUStepper_SetPicoMetersPerRev,
    FCUStepper_SetMaxRPM,
    FCUStepper_SetMicroStepResolution,
    FCUStreamingControlStart_AccelCalData,
    FCUStreamingControlStart_AccelFullData,
    FCUStreamingControlStop_Accel,
    FCUStreamingControlStart_Brakes,
    FCUStreamingControlStart_MotorsRaw,
    FCUStreamingControlStart_Lasers,
    FCUStreamingControlStart_ForwardLaser,
    FCUAccel_FineZero,
    FCUAccel_AutoZero,

    FCUContrast_StartStream,
    FCUContrast_StopStream,

    PowerAStopAllManualDischarging,
    PowerBStopAllManualDischarging,

    PowerAPowerLatch,
    PowerBPowerLatch,
    PowerAChargeRelayOff,
    PowerAChargeRelayOn,
    PowerAStreamingOff,
    PowerBStreamingOff,
    PowerAStreamCurrentTemps,
    PowerBStreamCurrentTemps,
    PowerAStreamTempLocations,
    PowerBStreamTempLocations,
    PowerARequestRomID,
    PowerBRequestRomID,
    PowerAStartCharging,
    PowerAStopCharging,
    PowerBStartCharging,
    PowerBStopCharging,
    PowerAStartDischarging,
    PowerAStopDischarging,
    PowerBStartDischarging,
    PowerBStopDischarging,
    PowerARequestBMS,
    PowerBRequestBMS,
    PowerARequestCooling,
    PowerAStartCooling,
    PowerBRequestCooling,
    PowerBStartCooling,
    PowerAStartRepressurizing,
    PowerBStartRepressurizing,
    PowerATestSolenoidPin4,
    PowerATestSolenoidPin8,
    PowerATestSolenoidPin16,
    PowerATestSolenoidPin22,
    PowerATestSolenoidPin23,
    PowerBTestSolenoidPin4,
    PowerBTestSolenoidPin8,
    PowerBTestSolenoidPin16,
    PowerBTestSolenoidPin22,
    PowerBTestSolenoidPin23,
    PowerAToPowerB,
    PowerBToPowerA,

    PodSafePowerNodeA,
    PodSafePowerNodeB,
    ForcePreRunPhase,

    FCUHover_Enable,
    FCUHover_Disable,
    FCUHover_EnableStaticHovering,
    FCUHover_ReleaseStaticHovering,
    FCUHover_EnableHEX,
    FCUHover_DisableHEX,
    FCUHover_SetHEXSpeed,
    FCUHover_StartCooling,
    FCUHover_StopCooling,
    FCUHover_OpenSolenoid,

    FCUAuxProp_Enable,
    FCUAuxProp_Disable,
    FCUAuxProp_SetSpeed,

    FCUGimbal_Static,
    FCUGimbal_FullBackwards,

    HETherm_ControlCooling,
    HETherm_ControlMode,

    XilinxSim_Start,
    XilinxSim_Stop,
    XilinxSim_Laser0On,
    XilinxSim_Laser0Off,
    XilinxSim_Laser1On,
    XilinxSim_Laser1Off,
    XilinxSim_Laser2On,
    XilinxSim_Laser2Off,

    AutoSequenceTest_Start,
    AutoSequenceTest_Skip,
    AutoSequenceTest_Kill,
    AutoSequenceTest_Restart,

    setChargerV,
    setChargerI,

    PySimControl,

    GrpcSetServer,
    GrpcStreamPackets,

    FCUGenPodCommand,

    ServerControlLogServiceStart,
    ServerControlLogServiceStop,
    ServerControlDatastoreManagerStart,
    ServerControlDatastoreManagerStop,
    ServerControlBroadcasterStart,
    ServerControlBroadcasterStop
  };
};
