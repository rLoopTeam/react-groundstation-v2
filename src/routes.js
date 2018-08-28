import React from 'react';
import { Route, IndexRoute } from 'react-router';
import MainLayout from './components/containers/MainLayout';
import Overview from './components/Overview';
import LGU from './components/LGU';
import AutoSequence from './components/AutoSequence';
import XilinxSim from './components/XilinxSim';
import FunctionalTest from './components/FunctionalTest';
import FlightControl_CalAccel from './components/FlightControl_CalAccel';
import FlightControl_FullAccel from './components/FlightControl_FullAccel';
import FlightControl_Contrast from './components/FlightControl_Contrast';
import FlightControl_NavigationSensors from './components/FlightControl_NavigationSensors';
import LineChart from './components/charts/LineChart';
import Brakes from './components/Brakes';
import Throttles from './components/Throttles';
import Steppers from './components/Steppers';
import DataStreamExample from './components/datasubexample';
import CommConfig from './components/CommConfig';
import DAQ from './components/DAQ';
import Power_Overview from './components/power/overview';
import Power_Comp2 from './components/power/Comp2Power.js';
import Power_RawTemperatures from './components/power/rawTemps';
import PowerNodeConfig from './components/PowerNodeConfig.js';
import HealthCheck from './components/HealthCheck.js';
import HealthCheckOverview from './components/HealthCheckOverview.js';
import AuxProp from './components/AuxProp.js';
import Cooling from './components/Cooling.js';
import StateMachine from './components/StateMachine.js';
import LandingGear from './components/LandingGear.js';
import TrackDb from './components/trackdb.js';
import Simulator from './components/SimControl';
import ServerControl from './components/ServerControl';
import AI_Project from './components/AI_Project';

const APP_ROUTES = (
  <Route path="/" component={MainLayout}>
    <IndexRoute component={Overview} />
    <Route path="dashboard" component={Overview} />
    <Route path="PowerNodeConfig" component={PowerNodeConfig} />
    <Route path="powerAOverview" component={Power_Overview} L="A"/>
    <Route path="powerARawTemps" component={Power_RawTemperatures} L="A" />
    <Route path="powerBOverview" component={Power_Overview} L="B"/>
    <Route path="powerBRawTemps" component={Power_RawTemperatures} L="B" />
    <Route path="powerComp2" component={Power_Comp2} L="A"/>
    <Route path="cooling" component={Cooling} />
    <Route path="lgu" component={LGU} />
    <Route path="AutoSequence" component={AutoSequence} />
    <Route path="XilinxSim" component={XilinxSim} />
    <Route path="FunctionalTest" component={FunctionalTest} />
    <Route path="FlightControl_FullAccel" component={FlightControl_FullAccel} />
    <Route path="FlightControl_CalAccel" component={FlightControl_CalAccel} />
    <Route path="FlightControl_Contrast" component={FlightControl_Contrast} />
    <Route path="FlightControl_NavigationSensors" component={FlightControl_NavigationSensors} />
    <Route path="throttles" component={Throttles} />
    <Route path="LineChart" component={LineChart} />
    <Route path="brakes" component={Brakes} />
    <Route path="Steppers" component={Steppers} />
    <Route path="datasubexample" component={DataStreamExample} />
    <Route path="commConfig" component={CommConfig} />
    <Route path="DAQ" component={DAQ} />
    <Route path="healthcheck" component={HealthCheckOverview} />
    <Route path="healthcheck/overview" component={HealthCheckOverview} viewMode="overview" />
    <Route path="healthcheck/detailed" component={HealthCheckOverview} viewMode="detailed" />
    <Route path="AuxProp" component={AuxProp} />
    <Route path="statemachine" component={StateMachine} />
    <Route path="landinggear" component={LandingGear} />
    <Route path="trackdb" component={TrackDb} />
    <Route path="Simulator" component={Simulator} />
    <Route path="Backend" component={ServerControl} />
    <Route path="AI_Project" component={AI_Project}/>
  </Route>
);

export default APP_ROUTES;
