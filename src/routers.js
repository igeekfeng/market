import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import Home from "./work/pages/home";
import Basic from "./work/pages/basic";
import Login from "./work/pages/login";
import EquipmentManage from "./work/pages/basic/equipmentManage";
import SchoolSetting from "./work/pages/basic/schoolSetting";
import UserManage from "./work/pages/basic/userManage";
import SetTable from "./work/pages/basic/setTable";

class Routers extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/home" component={Home}/>
          <Route path="/basic" render={() =>
            <Basic>
              <Switch>
                <Route path='/basic/user_manage' component={UserManage}/>
                <Route exact path="/basic/school_setting" component={SchoolSetting}/>
                <Route path="/basic/equipment_manage" component={EquipmentManage}/>
                <Route exact path="/basic/equipment_schedule_time" component={SetTable}/>
                <Redirect to="/basic/school_setting"/>
                {/* <Route component={NoMatch} /> */}
              </Switch>
            </Basic>
          }/>
          <Redirect to="/login"/>
        </Switch>
      </Router>
    );
  }
}

export default Routers;
