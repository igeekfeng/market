import React, {Component} from 'react';
import { Radio, Table, Divider, Tag} from 'antd'
import { deviceList } from '../../api/api'
const { Column } = Table;

class Equipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      equipmentList: [],
      total: 0
    }
  }

  getDeviceList(params={}) {
    deviceList(params).then(res => {
      if (res.status) {
        this.setState({
          equipmentList: res.data.list,
          total: res.data.pagenation.total
        })
      }
    })
  }

  componentWillMount() {
    this.getDeviceList({
      source_type: 1
    })
  }

  onChange = e => {
    this.setState({
      value: e.target.value
    })
    let params = {
      source_type: e.target.value
    }
    this.getDeviceList(params)
  }

  render() {
    return (
      <div className='equipment'>
        <div>
          <span>设备总数</span><span>{this.state.total}</span>
        </div>
        <div>
          <Radio.Group onChange={this.onChange} value={this.state.value}>
            <Radio value={1}>开十二版本</Radio>
            <Radio value={0}>单校版本</Radio>
          </Radio.Group>
        </div>
        <Table dataSource={this.state.equipmentList} rowKey='classcard_id'>
          <Column title="关联班级" dataIndex="class_name" />
          <Column title="省市" dataIndex="region_name" />
          <Column title="学校名称" dataIndex="school_name"/>
          <Column title="设备状态"
                  dataIndex="state"
                  render={state=>
                    (<Tag color={state===0?'red':'green'}>{state===0?'离线':'在线'}</Tag>)
                  }/>
          <Column
            title="设备模式"
            dataIndex="mode"
            render={mode => (
              <span>{mode===0?'标准模式':'门卫模式'}</span>
            )}/>
          <Column
            title="操作"
            key="action"
            render={(text, record) => (
              <span>
          <a>开机</a>
          <Divider type="vertical" />
          <a>关机</a>
        </span>
            )}
          />
        </Table>
      </div>
    );
  }
}

export default Equipment;
