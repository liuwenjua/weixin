import { APPID, getWechatOpenid } from '@/services/api'
import { cookie, querystring } from 'vux'

export default {
    data() {
        return {
            openId: null,
            url: window.location.href,
            query: {}
        }
    },
    created() {
        this.query = querystring.parse()
        if (process.env.NODE_ENV === 'production') {
            this.init()
        }
    },
    methods: {
        handleError(err, msg) {
            console.dir(err)
            let reason = err.message
            if (err.response && err.response.data && err.response.data.reason) {
                reason = err.response.data.reason
            }
            this.$vux.alert.show({
                // title: '操作提示',
                content: reason || msg || '参与人数太多请稍后再试！'
            })
        },
        async init() {
            this.openId = cookie.get('oid')
            if (this.openId) {
                console.log('openId found in cookie...')
                return
            }
            console.log('openId not found...')
            const { code } = this.query
            if (code) {
                try {
                    const res = await getWechatOpenid(code)
                    if (res && res.data) {
                        this.openId = res.data
                        const expires = new Date()
                        expires.setTime(Date.now() + 30 * 60 * 1000)
                        cookie.set('oid', this.openId, {
                            expires
                        })
                        const search = { ...this.query }
                        delete search.code
                        delete search.state
                        window.location.href = `${this.url.split('?')[0]}?${querystring.stringify(search)}`
                    } else {
                        this.handleError(null, '微信授权失败')
                    }
                } catch (error) {
                    this.handleError(error)
                }
            } else {
                const REDIRECT_URI = encodeURIComponent(this.url)
                window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_base&state=0#wechat_redirect`
            }
        }
    }
}
