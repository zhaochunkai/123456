/*
 * @Author: your name
 * @Date: 2019-10-09 08:54:41
 * @LastEditTime : 2019-12-18 16:53:52
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sw-warning\src\http\index.js
 */
import axios from 'axios'
import qs from 'qs'
import store from '../store/index'
import * as types from '../store/types'
import router from '../router'


// axios 配置(如果需要涉及到跨域问题，请在接口前拼接(this.axios.defaults.baseURL))
//代理：config--->index.js--->proxyTable
axios.defaults.timeout = 5000
// axios.defaults.baseURL = '/api'
console.log(process.env.API_ROOT)
axios.defaults.baseURL = process.env.API_ROOT;



// http request 拦截器
axios.interceptors.request.use(
    config => {
        if(config.method === 'post') {
            config.data = qs.stringify(config.data)
            config.headers["Content-Type"] = "application/x-www-form-urlencoded"
        }
        if (localStorage.token) {
            config.headers["Authorization"] = `Bearer ${localStorage.token}`
        }
        return config
    },
    err => {
        return Promise.reject(err)
    },
)

// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 401 清除token信息并跳转到登录页面
                    store.commit(types.LOGOUT)
                    // 只有在当前路由不是登录页面才跳转
                    router.currentRoute.path !== 'login' &&
                        router.replace({
                            path: 'login',
                            query: { redirect: router.currentRoute.path },
                        })
                case 400:
                    return status(400).json({
                        code: 400,
                        err_message: 'API拼写错误'
                    })
                case 500:
                    return status(500).json({
                        code: 500,
                        err_message: '服务器错误'
                    })
                case 1001:
                    return status(1001).json({
                        code: 1001,
                        err_message: '断网了'
                    })
            }
        }
        return Promise.reject(error.response.data)
    },
)

export default axios