import request from '@/utils/request'

export function login(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: 'http://192.168.3.113:9084/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    // url: '/vue-element-admin/user/info',
    url: 'http://192.168.3.113:9084/system/router',
    method: 'get',
    params: { token }
  })
}

export function getRole() {
  return request({
    url: 'http://192.168.3.113:9084/system/router',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
