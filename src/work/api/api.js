import axios from 'axios'
import qs from 'qs'

let instance = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

instance.interceptors.request.use(
  config => {
    let loading = document.getElementById('ajaxLoading');
    loading.style.display = 'block';
    const token = localStorage.getItem('Authorization')
    if (token) {
      config.headers.token = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
instance.interceptors.response.use(
  res => { // 正常返回
    let loading = document.getElementById('ajaxLoading');
    loading.style.display = 'none';
    if (res.status === 200) {
      res.data.status = 1
    } else {
      res.data.status = 0
    }
    return res.data
  },
  error => { // 异常返回
    let loading = document.getElementById('ajaxLoading');
    loading.style.display = 'none';
    if (error.response) {
      error.response.data.status = 0
      switch (error.response.status) {
        case 403:
          localStorage.setItem('Authorization','')
          window.location.href = '/'
          break
        case 401:
          localStorage.setItem('Authorization','')
          window.location.href = '/'
          break
        default:
          return error.response.data
      }
    }
  }
)

// 用户-登录
export const userLogin = params => {
  return instance.post('/user/login', qs.stringify(params))
}

// 用户-登录
export const editPass = params => {
  return instance.post('/user/edit_pass', qs.stringify(params))
}

// 用户-注销
export const logout = params => {
  return instance.post('/user/logout', qs.stringify(params))
}

// 设备列表
export const deviceList = params => {
  return instance.get('/manage/class_card/device_list', {
    params: params
  })
}

// 学校详情
export const schoolSettingInfo = params => {
  return instance.get('/school/school_setting/info', {
    params: params
  })
}

// 教师管理-教师列表
export const TeacherManageList = params => {
  return instance.get('/school/teacher_manage/list', {
    params: params
  })
}
// 教师管理-教师信息
export const TeacherManageInfo = params => {
  return instance.get('/school/teacher_manage/info', {
    params: params
  })
}
// 教师管理-教师添加更新
export const TeacherManageAdd = params => {
  return instance.post('/school/teacher_manage/add', qs.stringify(params))
}

// 教师管理-教师删除
export const TeacherManageDel = params => {
  return instance.post('/school/teacher_manage/del', qs.stringify(params))
}

// 教师管理-教师导入
export const TeacherManageImport = params => {
  return instance.post('/school/teacher_manage/excel_import', qs.stringify(params))
}

// 教师管理-导入处理进度
export const TeacherManageImportHandle = params => {
  return instance.get('/school/teacher_manage/import_handle', {
    params: params
  })
}

// 设备管理-设备列表
export const schoolDeviceManageList = params => {
  return instance.get('/school/device_manage/list', {
    params: params
  })
}

// 设备管理-班级列表
export const schoolDeviceClassList = params => {
  return instance.get('/school/device_manage/class_list', {
    params: params
  })
}

// 设备管理-设备添加
export const schoolDeviceManageAdd = params => {
  return instance.post('/school/device_manage/add', qs.stringify(params))
}

// 设备管理-设备编辑
export const schoolDeviceManageEdit = params => {
  return instance.post('/school/device_manage/edit', qs.stringify(params))
}

// 设备管理-添加副屏
export const schoolDeviceManageAddSecond = params => {
  return instance.post('/school/device_manage/add_second', qs.stringify(params))
}

// 设备管理-设备删除
export const schoolDeviceManageDel = params => {
  return instance.post('/school/device_manage/del', qs.stringify(params))
}

// 设备管理-一键使用
export const schoolSeviceManageOneTouch = params => {
  return instance.post('/teacher/school_device_manage_one_touch', qs.stringify(params))
}

// 设备管理-设置开关机时间
export const schoolDeviceManageShutdownTime = params => {
  return instance.post('/school/device_manage/shutdown_time', qs.stringify(params))
}

// 设备管理-显示开关机时间
export const schoolDeviceManageShutdownTimeInfo = params => {
  return instance.get('/school/device_manage/shutdown_time_info', {
    params: params
  })
}
