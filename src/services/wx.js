import { getWechatConfig } from '@/services/api'

const config = async (that, callback) => {
    // 接入微信JSSDK
    // 获取微信JSSDK配置
    try {
        const res = await getWechatConfig(that.url)
        if (res && res.data) {
            const d = res.data
            that.$wechat.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: d.appId, // 必填，公众号的唯一标识
                timestamp: parseInt(d.timestamp, 10), // 必填，生成签名的时间戳
                nonceStr: d.noncestr, // 必填，生成签名的随机串
                signature: d.signature, // 必填，签名，见附录1
                jsApiList: [
                    'onMenuShareAppMessage', // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
                    'onMenuShareTimeline' // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
                    // 'onMenuShareQQ', // 获取“分享到QQ”按钮点击状态及自定义分享内容接口
                    // 'onMenuShareWeibo' // 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            })
        }
    } catch (err) {
        console.dir(err)
        const { reason } = err.response && err.response.data
        that.$vux.alert.show({
            // title: '操作提示',
            content: reason || '参与人数太多请稍后再试！'
        })
    }

    that.$wechat.error(res => {
        that.$vux.toast.text('微信config失败')
    })

    that.$wechat.ready(res => {
        // that.$wechat.showAllNonBaseMenuItem()
        // 分享到朋友圈
        const { title, link, imgUrl, desc } = that.shareInfo
        that.$wechat.onMenuShareTimeline({
            title, // 分享标题
            link, // 分享链接
            imgUrl, // 分享图标
            success() {
                // 用户确认分享后执行的回调函数
                that.$vux.toast.text('分享成功')
            },
            cancel() {
                // 用户取消分享后执行的回调函数
            }
        })
        // 分享给朋友
        that.$wechat.onMenuShareAppMessage({
            title, // 分享标题
            desc, // 分享描述
            link, // 分享链接
            imgUrl, // 分享图标
            success: function() {
                // 用户确认分享后执行的回调函数
                that.$vux.toast.text('分享成功')
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
            }
        })
        // 如果需要定制ready回调方法
        if (typeof callback === 'function') {
            callback.call(that)
        }
    })
}

export default {
    install(vue) {
        if (!vue.$wxsdk) {
            vue.$wxsdk = { config }
        }

        vue.mixin({
            created: function() {
                this.$wxsdk = vue.$wxsdk
            }
        })
    }
}
