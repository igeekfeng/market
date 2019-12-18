import React, {Component} from 'react';
import {editPass, logout} from "../api/api";
import { Modal, Form, Input, Button, Menu, Dropdown, Icon, message } from 'antd';
import {Redirect} from 'react-router-dom'


  class UserCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  componentWillMount() {
    this.setState({
      userName: localStorage.getItem('UserName')
    })
  }

  handleOk = e => {
    console.log(e)
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  toChangePass = e => {
    this.setState({
      visible: true
    })
  }

  toLogout = () => {
    logout().then(res => {
      console.log(res)
      if (res.status) {
        localStorage.clear()
        message.success('已退出')
        window.location.href='/login'
        // this.props.pro.history.push('/login')
      }
    })
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <a rel="noopener noreferrer" href="javascript:void(0)" onClick={this.toChangePass}>
            修改密码
          </a>
        </Menu.Item>
        <Menu.Item>
          <a rel="noopener noreferrer" href="javascript:void(0)" onClick={this.toLogout}>
            退出登录
          </a>
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" href="javascript:void(0)">
            欢迎,<span>{this.state.userName}</span> <Icon type="down" />
          </a>
        </Dropdown>
        <Modal
          title="修改密码"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <EditForm cancel={this.handleCancel.bind(this)}/>
        </Modal>
      </div>
    );
  }
}

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let params = {
          old_password: values.oldPass,
          password: values.newPass
        }
        editPass(params).then(res => {
          console.log(res)
        })
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPass')) {
      callback('两次输入的密码不一致');
    } else {
      callback();
    }
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
        <Form.Item label='用户名'>
          {localStorage.getItem('UserName')}
        </Form.Item>
        <Form.Item label='当前密码'>
          {getFieldDecorator('oldPass', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              type='password'
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item label='新密码'>
          {getFieldDecorator('newPass', {
            rules: [{ required: true, message: 'Please input your Password!' },
              {min:6, max:20, message: '6-20位'}],
          })(
            <Input
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item label='确认新密码'>
          {getFieldDecorator('confirmPass', {
            rules: [{ required: true, message: 'Please input your username!' },
              {min:6, max:20, message: '6-20位'},
              {validator: this.compareToFirstPassword}],
          })(
            <Input
              placeholder="请确认新密码"
              type='password'/>,
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

const EditForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default UserCenter;
