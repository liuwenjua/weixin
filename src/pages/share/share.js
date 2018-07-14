// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import Second from './Second'
import { AlertPlugin, ToastPlugin, WechatPlugin, AjaxPlugin } from 'vux'
import WechatConfig from '@/services/wx'
import 'vux/src/styles/reset.less'
import 'flex.css'

Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(AjaxPlugin)
Vue.use(WechatPlugin) // wxjssdk
Vue.use(WechatConfig)

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    render: h => h(Second)
}).$mount('#share')
