import React, {Component} from 'react';
import {Input, Upload, Icon, message, Button} from 'antd';
import {schoolSettingInfo} from '../../api/api'

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class SchoolSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      name: '',
      tempName: '',
      logo: '',
      tempLogo: '',
      loading: false
    }
  }

  componentWillMount() {
    schoolSettingInfo().then(res => {
      this.setState({
        name: res.data.school_name,
        tempName: res.data.school_name,
        logo: res.data.logo
      })
    })
  }

  toEdit = ()=> {
    this.setState({
      isEdit: !this.state.isEdit
    })
  }

  changeName = e => {
    this.setState({
      tempName: e.target.value
    })
  }

  editName = ()=> {
    if (this.state.isEdit) {
      return <Input value={this.state.tempName} onChange={this.changeName}/>
    } else {
      return <span>{this.state.name}</span>
    }
  }

  cancelSetting = () => {
    this.setState({
      isEdit: false
    })
  }

  confirmSetting = () => {
    message.success('修改成功')
    this.setState({
      isEdit: false
    })
  }

  editImg= ()=> {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const { logo } = this.state;
    if (this.state.isEdit) {
      return <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {logo ? <img src={logo} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    } else {
      return <img src={this.state.logo} alt=""/>
    }
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  render() {
    return (
      <div className='school_setting'>
        <h2>学校设置</h2>
        <div>
          <div>
            <span>学校名称</span>
            {this.editName()}
            <Button type='link' onClick={this.toEdit}>编辑</Button>
          </div>
          <div>
            <span>学校LOGO</span>
            {this.editImg()}
          </div>
          {this.state.isEdit && <div>
            <Button onClick={this.cancelSetting}>取消</Button>
            <Button type='primary' onClick={this.confirmSetting}>确认</Button>
          </div>}
        </div>
      </div>
    );
  }
}

export default SchoolSetting;
