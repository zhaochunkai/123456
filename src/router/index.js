import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/hello'
import Login from '@/components/login'
import Main from '@/components/main'
import Monitor from '@/components/crumbs/monitor'
import Radar from '@/components/crumbs/radar'
import Loudspeaker from '@/components/crumbs/loudspeaker'
import Camera from '@/components/crumbs/camera'
import Led from '@/components/crumbs/led'
import Callpolicelist from '@/components/crumbs/callpolicelist'
import Alarmprocessing from '@/components/crumbs/alarmprocessing'
import Platforminfo from '@/components/crumbs/platforminfo'
import Configmanage from '@/components/crumbs/configmanage'
import Menumanage from '@/components/crumbs/menumanage'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'hello',
      component: Hello
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/monitor',
      name: 'main',
      component: Main,
      children: [
        {
          path: '/',
          name: 'monitor',
          component: Monitor,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/radar',
          name: 'radar',
          component: Radar,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/loudspeaker',
          name: 'loudspeaker',
          component: Loudspeaker,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/camera',
          name: 'camera',
          component: Camera,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/led',
          name: 'led',
          component: Led,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/callpolicelist',
          name: 'callpolicelist',
          component: Callpolicelist,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/alarmprocessing',
          name: 'alarmprocessing',
          component: Alarmprocessing,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/platforminfo',
          name: 'platforminfo',
          component: Platforminfo,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/configmanage',
          name: 'configmanage',
          component: Configmanage,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/menumanage',
          name: 'menumanage',
          component: Menumanage,
          meta: {
            requireAuth: true
          }
        }
      ]
    },
    {
      path: "*",
      redirect:"/"
    }
  ],
  linkActiveClass: 'active',
})


router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    var token = localStorage.getItem('token')
    if (token) {
      next();
    }
    else {
      alert('请重新登录！')
      next({
        path: '/login'
        // query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }
})


export default router
