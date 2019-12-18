import React, {Component} from 'react';
import {Button, Select, Input, Table, Tag, Modal, TimePicker, Switch} from 'antd'
import {Link} from 'react-router-dom'
import moment from 'moment';
import {
  schoolDeviceManageList,
  schoolDeviceClassList,
  schoolDeviceManageShutdownTimeInfo,
  schoolDeviceManageShutdownTime
} from '../../api/api'

const {Option} = Select;
const {Search} = Input;

class EquipmentManage extends Component {
  state = {
    columns: [
      {
        title: '设备MAC地址',
        dataIndex: 'mac_address',
        key: 'mac_address',
      },
      {
        title: '班级',
        dataIndex: 'class_name',
        key: 'class_name',
      },
      {
        title: '版本号',
        dataIndex: 'version',
        key: 'version'
      },
      {
        title: '设备状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (
          <span>{text === 1 ? <Tag color="green">在线</Tag> : <Tag color="red">离线</Tag>}</span>
        )
      },
      {
        title: '设备模式',
        dataIndex: 'mode',
        key: 'mode',
        render: (text, record) => (
          <span>{text === 0 ? '标准模式' : '门卫模式'}</span>
        )
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record) => (
          <span>
            <Button type="link" onClick={(e) => this.toEntry(record, e)}>信息录入</Button>
            <Button type="link" onClick={(e) => this.showDeleteConfirm(record, e)}>编辑</Button>
            <Button type="link" onClick={(e) => this.showDeleteConfirm(record, e)}>删除</Button>
      </span>
        )
      }],
    tableData: [],
    chooseData: [],
    pagination: {},
    visible: false,
    teacher: {}
  }

  componentDidMount() {
    this.init()
  }

  init = () => {
    schoolDeviceManageList().then(res => {
      this.setState({
        tableData: res.data.list
      })
    })
    schoolDeviceClassList().then(res => {
      this.setState({
        chooseData: res.data.list || []
      })
    })
  }
  toEntry = e => {

  }
  handleChange = e => {
    if (e === -1) {
      schoolDeviceManageList().then(res => {
        this.setState({
          tableData: res.data.list
        })
      })
    } else {
      let params = {
        classcard_id: e
      }
      schoolDeviceManageList(params).then(res => {
        this.setState({
          tableData: res.data.list
        })
      })
    }
  }

  handleSearch = e => {
    console.log(e)
    let params = {
      mac: e
    }
    schoolDeviceManageList(params).then(res => {
      this.setState({
        tableData: res.data.list
      })
    })
  }

  toSetTime = () => {
    this.setState({
      visible: true
    })
  }

  render() {
    return (
      <div className='equipment_manage'>
        <div className='head'>
          <span>设备管理</span>
          <Button type='link'>全部重启</Button>
          <Button type='link'>全部开机</Button>
          <Button type='link' onClick={this.toSetTime}>定时开关机</Button>
          <Link to="/basic/equipment_schedule_time">设置课表时间</Link>
          <Button type='link'>设置考勤时间</Button>
          <Button type='link'>添加设备</Button>
        </div>
        <div className='search'>
          <Select defaultValue="全部班级" style={{width: 120}} onChange={this.handleChange}>
            <Option value="-1">全部班级</Option>
            {this.state.chooseData.map(item => (
              <Option key={item.classcard_id} value={item.classcard_id}>{item.class_name}</Option>
            ))}
          </Select>
          <Search
            placeholder="搜索MAC码"
            onSearch={this.handleSearch}
            style={{width: 200}}
          />
        </div>
        <Table
          columns={this.state.columns}
          dataSource={this.state.tableData}
          rowKey="classcard_id"
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />
        <SetTime visible={this.state.visible}/>
      </div>
    );
  }
}

class SetTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
      timeList: [],
      shutdownDay: []
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      visible: nextProps.visible
    })
    schoolDeviceManageShutdownTimeInfo().then(res => {
      if (res.status) {
        this.setState({
          timeList: res.data.list.map(time => time.split('-')),
          shutdownDay: res.data.shutdown_day
        })
      }
    })
  }

  handleOk() {
    this.setState({
      confirmLoading: true
    })
    let data_json = JSON.stringify({
        shutdown_day: this.state.shutdownDay,
        list: this.state.timeList.map(time => (time.join('-')))
      }),
      params = {
        data: data_json
      }
    schoolDeviceManageShutdownTime(params).then(res => {
      this.setState({
        confirmLoading: false,
        visible: false
      })
      console.log(res)
    })
  }

  handleCancel() {
    this.setState({
      visible: false
    })

  }

  onChange = (time, timeString, index1, index2) => {
    let tempList = [...this.state.timeList]
    tempList[index1][index2] = timeString
    this.setState({
      timeList: tempList
    })
  }
  onSwitchChange1 = e => {
    let temArr = [...this.state.shutdownDay]
    if (e) {
      temArr.shift()
      this.setState({
        shutdownDay: temArr
      })
    } else {
      temArr.unshift('6')
      this.setState({
        shutdownDay: temArr
      })
    }
  }
  onSwitchChange2 = e => {
    let temArr = [...this.state.shutdownDay]
    if (e) {
      temArr.pop()
      this.setState({
        shutdownDay: temArr
      })
    } else {
      temArr.push('7')
      this.setState({
        shutdownDay: temArr
      })
    }
  }
  addTime = () => {
    let tempList = this.state.timeList.slice()
    tempList.push(['00:00', '00:00'])
    this.setState({
      timeList: tempList
    })
    console.log(this.state)
  }
  deleteTime = e => {
    let tempList = [...this.state.timeList]
    tempList.splice(e, 1)
    this.setState({
      timeList: tempList
    })
  }

  render() {
    const {visible, confirmLoading, timeList} = this.state;
    return (
      <Modal
        className='setTime'
        title="定时开关机时间"
        visible={visible}
        onOk={this.handleOk.bind(this)}
        okText='确定'
        cancelText='取消'
        confirmLoading={confirmLoading}
        onCancel={this.handleCancel.bind(this)}
        closable={false}
      >
        <div className='clearfix'>
          <div className='fl'>
            <span>在线时间</span>
          </div>
          <div className='main'>
            <div className='open'>
              周六开机 <Switch defaultChecked={this.state.shutdownDay.indexOf('6') === -1} onChange={this.onSwitchChange1}/>
              周日开机 <Switch defaultChecked={this.state.shutdownDay.indexOf('7') === -1} onChange={this.onSwitchChange2}/>
            </div>
            {timeList.map((time, index) => (
              <div className='pb10' key={index}>
                <TimePicker onChange={(time, timeString) => this.onChange(time, timeString, index, 0)} format='HH:mm'
                            placeholder='开始时间' defaultValue={moment(time[0], 'HH:mm')}/>
                <TimePicker onChange={(time, timeString) => this.onChange(time, timeString, index, 1)} format='HH:mm'
                            placeholder='结束时间' defaultValue={moment(time[1], 'HH:mm')}/>
                <Button type='link' onClick={(e) => this.deleteTime(index, e)}>删除</Button>
              </div>
            ))}

            <Button type='link' onClick={this.addTime}>添加定时</Button>
          </div>

        </div>
      </Modal>
    );
  }
}

export default EquipmentManage;
