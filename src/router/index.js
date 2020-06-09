import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'documentation', icon: 'documentation', affix: true }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'guide', icon: 'guide', noCache: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'profile', icon: 'user', noCache: true }
      }
    ]
  }
]

export const testRoutes = [
  {
    path: '/production',
    component: Layout,
    meta: { title: '商品管理', icon: 'commodity' },
    redirect: '/production/production_list',
    children: [
      {
        path: 'list',
        component: () => import('@/views/production/production_list'),
        name: 'production_list',
        meta: { title: '商品列表', icon: 'commodity' }
      },
      {
        path: 'type',
        component: () => import('@/views/production/production_type'),
        name: 'production_type',
        meta: { title: '商品分类', icon: 'commodity' }
      },
      {
        path: 'brand',
        component: () => import('@/views/production/production_brand'),
        name: 'production_brand',
        meta: { title: '商品品牌', icon: 'commodity' }
      },
      {
        path: 'add',
        component: () => import('@/views/production/production_add'),
        name: 'production_add',
        meta: { title: '新增商品', icon: 'commodity' }
      },
      {
        path: 'binding',
        component: () => import('@/views/production/production_binding'),
        name: 'production_binding',
        meta: { title: '捆绑商品查询', icon: 'commodity' }
      },
      {
        path: 'addbinding',
        component: () => import('@/views/production/production_addbinding'),
        name: 'production_addbinding',
        meta: { title: '新增捆绑商品', icon: 'commodity' }
      },
      {
        path: 'electron',
        component: () => import('@/views/production/production_electron'),
        name: 'production_electron',
        meta: { title: '地区虚拟库存查询', icon: 'commodity' }
      },
      {
        path: 'addelectron',
        component: () => import('@/views/production/production_addelectron'),
        name: 'production_addelectron',
        meta: { title: '新增地区虚拟库存', icon: 'commodity' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/production',
    component: Layout,
    meta: { title: '商品管理', icon: 'commodity' },
    redirect: '/production/list',
    children: [
      {
        path: 'list',
        component: () => import('@/views/production/production_list'),
        name: 'list',
        meta: { title: '商品列表', icon: 'commodity' }
      },
      {
        path: 'type',
        component: () => import('@/views/production/production_type'),
        name: 'type',
        meta: { title: '商品分类', icon: 'commodity' }
      },
      {
        path: 'brand',
        component: () => import('@/views/production/production_brand'),
        name: 'brand',
        meta: { title: '商品品牌', icon: 'commodity' }
      },
      {
        path: 'add',
        component: () => import('@/views/production/production_add'),
        name: 'add',
        meta: { title: '新增商品', icon: 'commodity' }
      },
      {
        path: 'binding',
        component: () => import('@/views/production/production_binding'),
        name: 'binding',
        meta: { title: '捆绑商品查询', icon: 'commodity' }
      },
      {
        path: 'addbinding',
        component: () => import('@/views/production/production_addbinding'),
        name: 'addbinding',
        meta: { title: '新增捆绑商品', icon: 'commodity' }
      },
      {
        path: 'electron',
        component: () => import('@/views/production/production_electron'),
        name: 'electron',
        meta: { title: '地区虚拟库存查询', icon: 'commodity' }
      },
      {
        path: 'addelectron',
        component: () => import('@/views/production/production_addelectron'),
        name: 'addelectron',
        meta: { title: '新增地区虚拟库存', icon: 'commodity' }
      }
    ]
  },
  // {
  //   path: '/order',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/order/index'),
  //       name: 'orders',
  //       meta: { title: '订单管理', icon: 'clipboard' }
  //     }
  //   ]
  // },
  // {
  //   path: '/stock',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/stock/index'),
  //       name: 'stocks',
  //       meta: { title: '库存管理', icon: 'stock' }
  //     }
  //   ]
  // },
  // {
  //   path: '/purchase',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/purchase/index'),
  //       name: 'purchases',
  //       meta: { title: '采购管理', icon: 'purchase' }
  //     }
  //   ]
  // },

  // {
  //   path: '/storehouse',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/storehouse/index'),
  //       name: 'storehouses',
  //       meta: { title: '仓库管理', icon: 'warehouse' }
  //     }
  //   ]
  // },
  // {
  //   path: '/role',
  //   component: Layout,
  //   meta: { title: '角色管理', icon: 'user' },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/role/index'),
  //       name: 'role',
  //       meta: { title: '角色管理', icon: 'user' }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/role/role_list'),
  //       name: 'role',
  //       meta: { title: '角色列表', icon: 'user' }
  //     }
  //   ]
  // },
  {
    path: '/file',
    component: Layout,
    meta: { title: '文件管理', icon: 'file' },
    redirect: '/file/list',
    children: [
      {
        path: 'list',
        component: () => import('@/views/file/file_list'),
        name: 'lists',
        meta: { title: '文件列表', icon: 'file' }
      },
      {
        path: 'upload',
        component: () => import('@/views/file/file_upload'),
        name: 'upload',
        meta: { title: '上传文件', icon: 'file' }
      }
    ]
  },
  {
    path: '/supplier',
    component: Layout,
    meta: { title: '供应商管理', icon: 'supplier' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/supplier/supplier_list'),
        name: 'supplier_list',
        meta: { title: '供应商列表', icon: 'supplier' }
      },
      {
        path: 'add',
        component: () => import('@/views/supplier/supplier_add'),
        name: 'supplier_add',
        meta: { title: '新增供应商', icon: 'supplier' }
      },
      {
        path: 'details',
        component: () => import('@/views/supplier/supplier_details'),
        name: 'supplier_details',
        hidden: true,
        meta: { title: '供应商详情', icon: 'supplier' }
      }
    ]
  },
  {
    path: '/staff',
    component: Layout,
    meta: { title: '职员管理', icon: 'supplier' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/staff/staff_list'),
        name: 'staff_list',
        meta: { title: '职员列表', icon: 'supplier' }
      },
      {
        path: 'add',
        component: () => import('@/views/staff/staff_add'),
        name: 'staff_add',
        meta: { title: '新增职员', icon: 'supplier' }
      },
      {
        path: 'details',
        component: () => import('@/views/staff/staff_details'),
        name: 'staff_details',
        hidden: true,
        meta: { title: '职员信息', icon: 'supplier' }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'rolePermission',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'icons', icon: 'icon', noCache: true }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  chartsRouter,
  nestedRouter,
  tableRouter,

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'example',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'createArticle', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'editArticle', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'articleList', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'tab', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: 'page401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'errorLog', icon: 'bug' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: 'exportExcel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: 'selectExcel' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: 'mergeHeader' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'uploadExcel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    name: 'Zip',
    meta: { title: 'zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'exportZip' }
      }
    ]
  },

  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index'),
        name: 'PDF',
        meta: { title: 'pdf', icon: 'pdf' }
      }
    ]
  },
  {
    path: '/pdf/download',
    component: () => import('@/views/pdf/download'),
    hidden: true
  },

  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'clipboardDemo', icon: 'clipboard' }
      }
    ]
  },

  {
    path: '/i18n',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/i18n-demo/index'),
        name: 'I18n',
        meta: { title: 'i18n', icon: 'international' }
      }
    ]
  },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'externalLink', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
