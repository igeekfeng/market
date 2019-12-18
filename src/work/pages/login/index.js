import React, { Component } from 'react'
import { userLogin } from '../../api/api'
import { Button, Input, Form, Checkbox, Icon, message } from 'antd'

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};
  }

  render () {
    return (
      <div className='login xxf-global'>
        <WrappedNormalLoginForm pro={this.props}/>
      </div>
    )
  }

}

class NormalLoginForm extends React.Component {

  handleSubmit = e => {
    var that = this
    console.log(that.props)
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let params = {
          username: values.username,
          password: values.password
        }
        userLogin(params).then((res)=>{
          if (res.status) {
            message.success('登陆成功')
            localStorage.setItem('Authorization',res.data.jwt_token)
            localStorage.setItem('GroupId',res.data.group_id)
            localStorage.setItem('UserName',res.data.user_name)
            if (res.data.group_id === 1) {
              that.props.pro.history.push('/home')
            } else {
              that.props.pro.history.push('/basic')
            }
          } else {
            message.error(res.msg, 3)
          }
        })
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>记住密码</Checkbox>)}
          <a className="login-form-forgot" href="#">
            忘记密码
          </a>
          <div className='fr'>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button> 或
            <a href="#">注册</a>
          </div>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

