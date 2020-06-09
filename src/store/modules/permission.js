import { constantRoutes, testRoutes } from '@/router'
// import { asyncRoutes, constantRoutes, testRoutes } from '@/router'
import { getRole } from '@/api/user'
import Layout from '@/layout'

/**
 * 使用元角色确定当前用户是否具有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

export function generaMenu(routes, data) {
  data.forEach(item => {
    // alert(JSON.stringify(item))
    // const component = item.rank === 1 ? Layout : () => import('@/views/' + item.folder + '/' + item.name)
    console.log('1', '@/views/production/production_list')
    console.log('2', '@/views/' + item.folder + '/' + item.name)
    console.log('3', `@/views/${item.folder}/${item.name}`)
    var url = '@/views/production/production_list'
    console.log('url', '@/views/' + item.folder + '/' + item.name)
      var menu = {
        path: item.path,
        // component: item.rank === 1 ? Layout : () => import('@/views/production/production_list'),
        component: item.rank === 1 ? Layout : () => import(url),
        // component: item.rank === 1 ? Layout : () => import('@/views/' + item.folder + '/' + item.name),

        // component: item.rank === 1 ? Layout : () => import(`@/views/${item.folder}/${item.name}`),

        // component: item.router_grade === 1 ? Layout : () => import(`@/views/${item.router_folder}/${item.router_path}`),
        // component: item.router_grade === 1 ? Layout : () => import(/* webpackChunkName: "chunk-aaa` */ `@/views/${item.router_folder}/${item.router_path}`),

        // hidden: item.hide === 1 ? true : false,  // 是否隐藏
        // alwaysShow: item.router_grade === 1 ? true : false,  // 是否一直展开
        children: [],
        name: item.name,
        meta: { title: item.title, icon: item.icon },
        redirect: item.redirect // 重定向
      }
      if (item.children) {
        generaMenu(menu.children, item.children)
      }
      routes.push(menu)
  })
  return routes
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      getRole().then(response => {
        const { data } = response
        var newRouter = []
        newRouter = generaMenu(newRouter, data)
        // newRouter = filterAsyncRoutes(newRouter, roles)
        console.log('80', newRouter)
        commit('SET_ROUTES', newRouter)
        resolve(newRouter)
      }).catch(error => {
        reject(error)
      })
      console.log(testRoutes)
      // let accessedRoutes
      // // if (roles.includes('admin')) {
        // accessedRoutes = asyncRoutes || []
      // // } else {
      // accessedRoutes = filterAsyncRoutes(testRoutes, roles)
      // // }
      // console.log('93', accessedRoutes)
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
