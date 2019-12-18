import React, {Component} from 'react';
import { Table, Divider, Button, Modal, Form, Input, Radio, message, Icon, Upload, Progress} from 'antd';
import {TeacherManageInfo, TeacherManageList, TeacherManageAdd, TeacherManageDel, TeacherManageImport, TeacherManageImportHandle} from '../../api/api'
const { confirm } = Modal;

class UserManage extends Component {
  state = {
    columns: [
      {
      title: '教师姓名',
      dataIndex: 'teacher_name',
      key: 'teacher_name',
    },
      {
        title: '账号',
        dataIndex: 'account',
        key: 'account',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        render: (text, record) => (
          <span>{text===1?'男':'女'}</span>
        )
      },
      {
        title: '班主任',
        dataIndex: 'head_class',
        key: 'head_class',
      },
      {
        title: '任课班级',
        dataIndex: 'course_class',
        key: 'course_class',
      },
      {
        title: '其他权限',
        dataIndex: 'other_power',
        key: 'other_power',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record) => (
          <span>
            <Button type="link" onClick={(e) => this.toEditTeacher(record, e)}>编辑</Button>
        <Divider type="vertical" />
            <Button type="link" onClick={(e) => this.showDeleteConfirm(record, e)}>删除</Button>
      </span>
        )
      }],
    tableData: [],
    pagination: {},
    to: 1,
    visible: false,
    visible1: false,
    uploadProgress: 0, //0 待导入，1 导入中 2 导入完成 3 导入失败
    teacher: {}
  }
  componentWillMount() {
    this.init()
  }

  init = () => {
    this.setState({
      visible: false
    })
    TeacherManageList().then(res => {
      console.log(res)
      if (res.status) {
        this.setState({
          tableData: res.data.list,
          pagination: res.data.pagenation
        })
      }
    })
  }

  /**
   * 编辑教师
   * @param e
   */
   toEditTeacher = e => {
    console.log(e)
     let params = {
       teacher_id: e.teacher_id
     }
     TeacherManageInfo(params).then(res => {
       if (res.status){
         console.log(res)
         this.setState({
           to: 2,
           visible: true,
           teacher: res.data
         })
       }
     })
  }

   showDeleteConfirm = e => {
     var that = this;
    confirm({
      title: '确认删除'+ e.teacher_name +'?',
      content: '请确认后进行操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        let params = {
          teacher_id: e.teacher_id
        }
        TeacherManageDel(params).then(res => {
          if (res.status) {
            message.success('删除成功')
            that.init()
          } else {
            message.error(res.msg)
          }
        })
      },
      onCancel() {
      },
    });
  }

  toAddTeacher() {
    this.setState({
      to: 1,
      visible: true,
      teacher: {
        account: "",
        is_head: 0,
        is_school: 0,
        sex: 1,
        teacher_name: ""
      }
    })
  }

  toImportTeacher = () => {
     this.setState({
       visible1: true
     })
  }


  handleCancel = () => {
    this.setState({
      visible: false,
      visible1: false,
      uploadProgress: 0
    })
  }

  cancel = () => {
    this.setState({
      visible: false
    })
  }

  toDownloadTemp(){
     window.location.href='http://121.41.99.232:50001/file/2019/07/04/140800229-IFDRjyvR.xls?rename=教师管理导入模板'
  }

  handleTableChange = (pagination) => {
    let params = {
      page: pagination.current,
      per_page: pagination.pageSize
    }
    TeacherManageList(params).then(res => {
      if (res.status) {
        this.setState({
          tableData: res.data.list,
          pagination: res.data.pagenation
        })
      }
    })
  }

  render() {
     var that = this;
    const props = {
      name: 'file',
      action: 'http://121.41.99.232:20001/shard_upload',
      accept: '.xls,.xlsx',
      headers: {
        'X-Requested-With':null,
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbiI6InRvYiIsImNoaWxkX3VzZXJfaWQiOjU1Niwic2Nob29sX2NvZGUiOiJrMTJzY2hvb2xfMDJfdGVzdCIsInVzZXJfaWQiOjE2ODN9.pY6RCE0mcZGxqmi3UArtaeC0W2iwbRQ9Oo8vLw9CA7c'
      },
      onChange(info) {
        if (info.file.status === 'done') {
          var params = {
            key: info.file.response.data.url
          }
          TeacherManageImport(params).then(res => {
            if (res.status) {
              function getResponse() {
                TeacherManageImportHandle(params).then(res =>{
                  console.log(res)
                  if (res.data.status === 2) {
                    that.setState({
                      uploadProgress: 1
                    })
                  } else if (res.data.status === 0) {
                    that.setState({
                      uploadProgress: 3
                    })
                  } else {
                    that.setState({
                      uploadProgress: 2
                    })
                  }
                })
              }
              var timer1 = setInterval(() => {
                if (that.state.uploadProgress === 2 || that.state.uploadProgress === 3) {
                  clearInterval(timer1)
                  return
                }
                getResponse()
              }, 1000)

            }
          })
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败.`);
        }
      },
    };
    return (
      <div className="user-manage">
        <div>
          <span className="fz24">用户管理</span>
          <Button type="link" onClick={this.toAddTeacher.bind(this)}>添加教师</Button>
          <Button type="link" onClick={this.toImportTeacher}>导入教师</Button>
        </div>
        <Table
          columns={this.state.columns}
          dataSource={this.state.tableData}
          rowKey="teacher_id"
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />
        <Modal
          title={this.state.to===1?'添加教师':'编辑教师'}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <EditForm teacher={this.state.teacher} cancel={this.cancel} to={this.state.to} init={this.init}/>
        </Modal>
        <Modal
          title='导入教师'
          visible={this.state.visible1}
          onCancel={this.handleCancel}
          footer={(<Button type='primary' onClick={this.handleCancel}>确定</Button>)}
        >
          {this.state.uploadProgress === 0 && <div><Upload {...props}>
            <Button type='primary'>
              <Icon type="upload" /> 选择文件
            </Button>
          </Upload>
          <Button type='link' onClick={this.toDownloadTemp}>下载模板</Button></div>}
          {this.state.uploadProgress === 3 && <div>
            <span>导入失败,请检查文件后重新导入</span>
          </div>}
          {this.state.uploadProgress === 1 && <div>
            <Progress percent={50} status="active" />
          </div>}
          {this.state.uploadProgress === 2 && <div>
            <span>导入成功</span>
          </div>}
        </Modal>
      </div>
    );
  }
}

class NormalEditForm extends Component {
  state = {
    teacher: {}
  }

  componentWillMount() {
    this.setState({
      teacher: this.props.teacher
    })
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      teacher: nextProps.teacher
    })
  }

  /**
   * 表单提交
   * @param e
   */
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.props.to===2) {
          values.teacher_id = this.state.teacher.teacher_id
        }
        TeacherManageAdd(values).then(res => {
          if (res.status) {
            if (this.props.to===2) {
              message.success('编辑成功')
              this.props.init()
            } else {
              message.success('添加成功')
              this.props.init()
            }
          } else{
            message.error(res.msg)
          }
        })
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 15
      },
    };

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit} className="edit-form">
        <Form.Item label='真实姓名'>
          {getFieldDecorator('teacher_name', {
            rules: [{ required: true, message: 'Please input your username!' }],
            initialValue: this.state.teacher.teacher_name
            })(
            <Input/>,
          )}
        </Form.Item>
        <Form.Item label='性别'>
          {getFieldDecorator('sex', {
            rules: [{ required: true, message: 'Please input your username!' }],
            initialValue: this.state.teacher.sex
          })(
            <Radio.Group >
              <Radio value={1}>男</Radio>
              <Radio value={0}>女</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label='账号'>
          {getFieldDecorator('account', {
            rules: [{ required: true, message: 'Please input your username!' }],
            initialValue: this.state.teacher.account
          })(
            <Input/>,
          )}
        </Form.Item>
        <Form.Item label='班主任'>
          {getFieldDecorator('is_head', {
            rules: [{ required: true, message: 'Please input your username!' }],
            initialValue: this.state.teacher.is_head
          })(
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label='校领导'>
          {getFieldDecorator('is_school', {
            rules: [{ required: true, message: 'Please input your username!' }],
            initialValue: this.state.teacher.is_school
          })(
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item >
          <Button type="default" onClick={this.props.cancel}>
            取消
          </Button>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
const EditForm = Form.create({
  // ****** 这里只处理了字符串类型， 像日期在 antd 中要传 moment 类型
// **** 针对一些特殊字段要做单独处理
  mapPropsToFields (props) {
    return Form.createFormField(
      {
        // name: props.teacher.name,
        // account: props.teacher.account,
        // sex: props.teacher.sex,
        // head: props.teacher.head ===''?0:1,
        // other: props.teacher.other===''?0:1,
      }
      )
  },
})(NormalEditForm);

export default UserManage;
