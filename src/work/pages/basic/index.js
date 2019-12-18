import React, {Component} from 'react';
import {Menu, Icon, Button} from 'antd';
import {Link} from 'react-router-dom'
import UserCenter from "../../components/userCenter";

class Basic extends Component {
  state = {
    collapsed: false,
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  switchTab = ({item, key, keyPath, domEvent}) => {
    console.log(key)
  }

  render() {
    return (
      <div className='xxf-global basic clearfix'>
        <div className=' left'>
          <Button type="primary" onClick={this.toggleCollapsed} style={{marginBottom: 16}}>
            <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}/>
          </Button>
          <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
            onClick={this.switchTab}
          >
            <Menu.Item key="1">
              <Icon type="pie-chart"/>
              <span>学校设置</span>
              <Link to='/basic/school_setting'/>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="desktop"/>
              <span>用户管理</span>
              <Link to='/basic/user_manage'/>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="inbox"/>
              <span>设备管理</span>
              <Link to='/basic/equipment_manage'/>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="inbox"/>
              <span>设备管理</span>
              <Link to='/basic/todo_list'/>
            </Menu.Item>
          </Menu>
        </div>
        <div className='right'>
          <div className='basic-head clearfix'>
            <div className='fr'>
              <UserCenter pro={this.props}/>
            </div>
          </div>
          {this.props.children}
        </div>
      </div>

    );
  }
}

export default Basic;
