import Vue from 'vue'

const API = {
    wechatAuth: '/yyapi/msg/api/v1/chanel/wechat/wechatOpenId',
    wechatConfig: '/yyapi/fs/api/v1/weixin/config',
    action: '/yyapi/activity/api/v1/action',
    verification: '/yyapi/user/api/v1/verification'
}

export const APPID = 'wxf46bc4b728cc760d'

export const getWechatOpenid = code =>
    Vue.http({
        url: `${API.wechatAuth}/${code}`
    })

export const getWechatConfig = url =>
    Vue.http({
        url: API.wechatConfig,
        params: {
            url
        }
    })

// 查看所有用户中奖记录
export const getAllAction = params =>
    Vue.http({
        url: `${API.action}/${params.actionCfgId}`,
        params
    })

// 查看用户中奖日志
export const getUserAction = params =>
    Vue.http({
        url: `${API.action}/${params.actionCfgId}/user/${params.openId}`
    })

// 抽奖
export const doAction = params =>
    Vue.http({
        url: `${API.action}/${params.actionCfgId}/user/${params.keyType}/${
            params.openId
        }`,
        method: 'post',
        data: params.data
    })

// 短信验证码
export const getVerifyCode = params =>
    Vue.http({
        url: `${API.verification}/phone/${params.phone}/${params.type}` // type: login / restpwd
    })

// 查看用户wechat详情
export const getUserWechat = uActivityId =>
Vue.http({
    url: `${API.action}/user/${uActivityId}/openId`
})

// 查看活动详情
export const getActivity = actionCfgId =>
Vue.http({
    url: `${API.action}/detail/${actionCfgId}`
})
