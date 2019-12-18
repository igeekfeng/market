import React from 'react'
import { Tabs } from 'antd'
import Header from "../../components/header";
import Equipment from "./equipment";

const { TabPane } = Tabs;
export default class Home extends React.Component {
  render() {
    return (
      <div className="home-wrap xxf-global">
        <Header pro={this.props}/>
        <div className="w1200">
          <Tabs defaultActiveKey="1" animated={false}>
            <TabPane tab="设备列表" key="1">
              <Equipment />
            </TabPane>
            <TabPane tab="学校列表" key="2">
              Content of Tab Pane 2
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

