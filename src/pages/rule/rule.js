// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Third from './Third'
import 'vux/src/styles/reset.less'
import 'flex.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    render: h => h(Third)
}).$mount('#rule')
