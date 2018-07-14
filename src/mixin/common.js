import { getAllAction, getUserAction, doAction, getActivity } from '@/services/api'
import {
    Marquee,
    MarqueeItem
    // XDialog
    // TransferDomDirective as TransferDom
} from 'vux'
import yunDialog from '@/components/yunDialog'
import countdown from '@xkeshi/vue-countdown'

export default {
    // directives: {
    //     TransferDom
    // },
    components: {
        Marquee,
        MarqueeItem,
        yunDialog,
        countdown
    },
    data() {
        return {
            uActivityId: null,
            shareInfo: {
                title: '孕云元宵送大礼！',
                link: '',
                imgUrl: `${process.env.OSS}/gift-share.dbd14e5.png`,
                desc: '快来帮助好友解锁花灯！只要参与都有惊喜哦~'
            },
            isFollowed: null, // 是否已关注公众号
            num: 0, // 剩余抽奖次数
            sum: 0, // 中奖总金额
            phone: '', // 绑定的手机号
            news: [], // 所有用户的中奖记录
            logs: [], // 自己的中奖纪录
            win: 0, // 单次抽中的金额，0表示未中奖
            loading: false,
            dialog: {
                show: false,
                follow: false,
                share: false,
                win: false,
                miss: false,
                bind: false,
                bindable: true
            },
            timeLeft: 0,
            lantern: {
                c1: {
                    label: '温柔分娩灯',
                    res: ''
                },
                c2: {
                    label: '好运连连灯',
                    res: ''
                },
                c3: {
                    label: '孕期快乐灯',
                    res: ''
                },
                c4: {
                    label: '享受月子灯',
                    res: ''
                },
                c5: {
                    label: '万象更新灯',
                    res: ''
                },
                c6: {
                    label: '健康成长灯',
                    res: ''
                }
            }
        }
    },
    mounted() {
        if (process.env.NODE_ENV === 'production') {
            if (this.openId) {
                this.wxConfig()
                this.next()
                setTimeout(() => {
                    this.loadAll()
                }, 1000)
            }
        } else {
            this.mock()
        }
        this.countdown()
    },
    methods: {
        wxConfig() {
            this.shareInfo.link = window.location.href
            this.$wxsdk.config(this)
        },
        async countdown() {
            try {
                const res = await getActivity(this.query.aid)
                if (res && res.data) {
                    const { endTime } = res.data
                    if (endTime) {
                        this.timeLeft = endTime - Date.now()
                    }
                }
            } catch (error) {
                this.handleError(error)
            }
            // const s = [2018, 3, 2, 17, 0, 0]
            // const deadline = new Date()
            // deadline.setFullYear(s[0])
            // deadline.setMonth(s[1] - 1)
            // deadline.setDate(s[2])
            // deadline.setHours(s[3])
            // deadline.setMinutes(s[4])
            // deadline.setSeconds(s[5])
            // this.timeLeft = deadline.getTime() - Date.now()
        },
        async next() {
            try {
                const res = await getUserAction({
                    actionCfgId: this.query.aid,
                    openId: this.openId
                })
                if (res && res.data) {
                    const { joinInfo } = res.data
                    if (joinInfo) {
                        this.num = parseInt(joinInfo.num || 1, 10)
                        this.sum = (parseFloat(joinInfo.sum || 0, 10) / 100).toFixed(2)
                        this.phone = joinInfo.phone
                        this.dialog.bindable = !Boolean(this.phone)
                        this.isFollowed = Boolean(joinInfo.isFoucus)
                        this.refreshLogs(joinInfo.gifts)
                    } else {
                        this.follow()
                    }
                }
            } catch (error) {
                this.handleError(error)
            }
        },
        refreshLogs(gifts = []) {
            this.logs = []
            gifts.forEach(n => {
                if (n.ext) {
                    let { count, index, getType, aUser } = n.ext
                    count = (count / 100).toFixed(2)
                    const lt = this.lantern[`c${index}`] || {}
                    // 自己抽的
                    if (getType === 'main') {
                        this.logs.push({
                            action: `打开${lt.label}获得了`,
                            count
                        })
                        lt.res = `${count}元`
                        this.uActivityId = n.uActivityId
                    } else {
                        this.logs.push({
                            name: aUser,
                            action: `解锁花灯获得了`,
                            count
                        })
                    }
                }
            })
        },
        async loadAll() {
            try {
                const { data } = await getAllAction({
                    actionCfgId: this.query.aid,
                    page: 1,
                    'page-size': 20
                })
                if (data.joinInfo && data.joinInfo.gifts) {
                    if (data.joinInfo.gifts.length === 0) {
                        this.news = []
                        return
                    }
                    const news = []
                    data.joinInfo.gifts.forEach(n => {
                        if (n.ext) {
                            const { count, index, getType, mUser } = n.ext
                            if (count <= 0) return
                            news.push({
                                name: mUser,
                                action: getType === 'main' ? '打开花灯' : '帮朋友解锁',
                                count: (count / 100).toFixed(2)
                            })
                        }
                    })
                    const before = [...news]
                    before.unshift(before.pop())
                    const after = [...news]
                    after.push(after.shift())
                    this.news = [before, news, after]
                }
            } catch (error) {
                this.handleError(error)
            }
        },
        follow() {
            this.dialog.follow = true
            this.dialog.show = true
        },
        afterBind() {
            this.dialog.show = false
            this.dialog.bind = false
            this.$vux.alert.show({
                // title: '操作提示',
                content: '手机号已成功绑定！'
            })
            this.next()
        },
        share() {
            this.dialog.show = true
            this.dialog.share = true
            // this.dialog = {
            //     show: true,
            //     follow: false,
            //     share: false,
            //     win: false,
            //     miss: true,
            //     bind: false,
            //     bindable: true
            // }
            // this.$vux.alert.show({
            //     title: '邀请好友',
            //     content: '点击右上角的按钮，选择分享给好友或发送至朋友圈',
            //     buttonText: '我知道了'
            // })
        },
        mock() {
            // for mock only
            this.query.aid = 'e7a931babc8b4e93842dd36a7092b36c'
            this.openId = 'o8Mcn1aVjhyCjEWv5aM9Qyw7Eudk'
            this.loadAll()
            this.next()
            // const news = Array.apply(null, { length: 15 }).map((n, i) => {
            //     return {
            //         name: `用户${i}`,
            //         res: Math.ceil(Math.random() * 8)
            //     }
            // })
            // const before = [...news]
            // before.unshift(before.pop())
            // const after = [...news]
            // after.push(after.shift())
            // this.news = [before, news, after]

            // this.logs = Array.apply(null, { length: 5 }).map((n, i) => {
            //     return {
            //         name: `用户${i}`,
            //         res: Math.ceil(Math.random() * 50)
            //     }
            // })
        }
    }
}
