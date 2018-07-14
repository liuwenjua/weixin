<template>
    <div id="share">
        <div class="header">
            <img width="100%" src="../../assets/images/bg-head.png" alt="">
        </div>
        <div class="wrap">
            <img class="lion" width="100%" src="../../assets/images/lion.png" alt="">
            <div class="wrap-lion">
                <div class="wrap-head">
                    <img class="wrap-head-top" width="100%" src="../../assets/images/wrap-head.png" alt="">
                    <div class="content" flex="dir:top box:justify">
                        <div class="top-tip">帮助{{nickname}}解锁花灯，Ta将获得1次抽奖机会！</div>
                        <div class="row">
                            <img width="100%" src="../../assets/images/lantern-share.png" alt="">
                        </div>
                        <div>
                            <div class="btn" flex="main:center cross:center box:mean">
                                <span @click="submit"><img width="100%" src="../../assets/images/help.png" alt="帮他解锁"></span>
                                <span @click="join"><img width="100%" src="../../assets/images/join.png" alt="我也参加"></span>
                            </div>
                            <div class="rule" flex="main:center cross:center">
                                <span class="wrap-wing"></span>
                                <a href="./rule.html">活动规则</a>
                                <span class="wrap-wing"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="wrap-foot">
                    <img width="100%" src="../../assets/images/wrap-foot.png" alt="">
                </div>
                <div class="divider">
                    <img width="85%" src="../../assets/images/divider.png" alt="">
                </div>
                <div class="box-head">
                    <img width="100%" src="../../assets/images/box-head.png" alt="">
                    <div class="box-title first" flex="main:center cross:center">
                        <span class="wrap-wing"></span>
                        <span class="title">中奖记录</span>
                        <span class="wrap-wing"></span>
                    </div>
                    <div class="log-box">
                        <marquee v-for="(item, j) in news" :key="j">
                            <marquee-item v-for="(user, i) in item" :key="i" flex="box:first">
                                <div class="u-avatar">
                                    <span class="iconfont icon-user-circle"></span>
                                </div>
                                <div class="u-log" flex="cross:center">
                                    <span class="uname">{{user.name}}</span>
                                    <span>{{user.action}}获得了</span>
                                    <span class="money">{{user.count}}元</span>
                                </div>
                            </marquee-item>
                        </marquee>
                    </div>
                    <div class="divider">
                        <img width="85%" src="../../assets/images/logo.png" alt="">
                    </div>
                    <div class="box-title" flex="main:center cross:center">
                        <span class="wrap-wing"></span>
                        <span class="title">我累计获奖:
                            <span class="red">{{sum}}元</span>
                        </span>
                        <span class="wrap-wing"></span>
                    </div>
                    <div class="my-tip cash">
                        <div v-if="sum < 1">大于1元才能领奖</div>
                        <div v-else>奖金将于3月8日10:30统一发放</div>
                        <countdown v-if="timeLeft" :interval="5000" :time="timeLeft" :leading-zero="false">
                            <template slot-scope="props">活动结束倒计时：{{props.days}}天{{props.hours}}小时{{props.minutes}}分</template>
                        </countdown>
                    </div>
                    <div class="my-tip" v-show="logs.length === 0">
                        空空如也，快去参加活动赢大奖吧！
                    </div>
                    <div class="log-box">
                        <ul class="log-box-wrap">
                            <li v-for="(user, index) in logs" :key="index" flex="cross:center" class="u-log">
                                <span>我</span>
                                <span v-if="user.name" class="uhelp">帮</span>
                                <span v-if="user.name" class="uname">{{user.name}}</span>
                                <span>{{user.action}}</span>
                                <span class="money">{{user.count}}元</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="box-foot">
                    <img width="100%" src="../../assets/images/box-foot.png" alt="">
                </div>
            </div>
            <div class="wrap-lion-tail">
                <img width="100%" src="../../assets/images/lion-tail.png" alt="">
            </div>
        </div>
        <div class="footer">
            孕云 · 希望天下妈妈幸福
        </div>
        <yun-dialog :dialog="dialog" :win="win" :open-id="openId" @user-bind="afterBind" follow-tip="重新打开朋友分享的活动链接帮Ta解锁"></yun-dialog>
    </div>
</template>

<script>
import wechat from '@/mixin/wechat'
import common from '@/mixin/common'
import { doAction, getUserWechat } from '@/services/api'

export default {
    mixins: [wechat, common],
    data() {
        return {
            nickname: '',
            unlock: false
        }
    },
    mounted() {
        if (!this.query.mid) {
            this.join()
        } else {
            this.getUserWechat()
        }
    },
    watch: {
        uActivityId(val) {
            // 自己不能给自己助力
            if (val !== null && val === this.query.mid) {
                window.location.href = `${process.env.APP_DOMAIN}/index.html?aid=${this.query.aid}`
            }
        }
    },
    methods: {
        wxConfig() {
            this.shareInfo.link = `${process.env.APP_DOMAIN}/share.html?aid=${this.query.aid}&mid=${this.query.mid}`
            this.$wxsdk.config(this)
        },
        join() {
            window.location.href = `${process.env.APP_DOMAIN}/index.html?aid=${this.query.aid}`
        },
        async getUserWechat() {
            try {
                const { data } = await getUserWechat(this.query.mid)
                this.nickname = data.nickname
            } catch (err) {
                console.error(err)
            }
        },
        async submit() {
            if (this.unlock) {
                // 已解锁
                this.$vux.alert.show({
                    // title: '操作提示',
                    content: '您已经帮Ta解锁啦',
                    buttonText: '我知道了'
                })
                return
            }
            if (this.loading) return
            if (this.isFollowed === null) return // 说明next()还没执行完，不确定当前用户是否已关注公众号
            if (this.isFollowed === false) {
                return this.follow()
            }
            if (this.query.mid) {
                this.loading = true
                try {
                    const { data } = await doAction({
                        actionCfgId: this.query.aid,
                        keyType: 'openId',
                        openId: this.openId,
                        data: {
                            phone: this.phone,
                            participateinfo: {
                                getType: 'assist',
                                orther: this.query.mid // 帮这个uActivityId的用户解锁
                            }
                        }
                    })
                    if (!data.success) {
                        this.$vux.alert.show({
                            // title: '操作提示',
                            content: data.msg,
                            buttonText: '我知道了'
                        })
                        return
                    }
                    this.unlock = true
                    if (data.joinInfo) {
                        const { cost } = data.joinInfo
                        if (cost > 0) {
                            this.win = cost
                            this.dialog.win = true
                        } else {
                            this.dialog.miss = true
                        }
                        this.dialog.show = true
                        await this.next()
                    }
                } catch (error) {
                    this.handleError(error)
                }
                this.loading = false
            }
        }
    }
}
</script>

<style lang="less" scoped>
#share {
    width: 100%;
    height: 100%;
    background: url('../../assets/images/bg-body.png') center repeat-y;
    background-size: contain;
    color: #5d0f02;
    position: relative;
    img {
        pointer-events: none;
    }
}
.footer {
    text-align: center;
    font-size: 1.13rem;
    color: #ffc9c0;
    position: absolute;
    bottom: 5rem;
    width: 100%;
}
.wrap {
    width: 80%;
    margin: 0 10%;
    transform: translateY(-10rem);
    &-lion {
        background: url('../../assets/images/lion-body.png') -1px 10rem repeat-y;
        background-size: contain;
        margin-top: -8px;
        padding-top: 15px;
        &-tail {
            margin-top: -2.5rem;
        }
    }
    &-wing {
        display: inline-block;
        height: 0.71rem;
        width: 0.71rem;
        background: url('../../assets/images/rule.png') center no-repeat;
        background-size: contain;
    }
    .wrap-head {
        z-index: 1;
        position: relative;
        width: 90%;
        margin: 0 5%;
        background: url('../../assets/images/wrap-body.png') center repeat-y;
        background-size: contain;
        &-top {
            // transform: translateY(-3.8rem);
            margin-top: -10rem;
        }
        .content {
            // transform: translateY(-5.8rem);
            margin-top: -2rem;
            text-align: center;
            height: 26rem;
            .top-tip {
                padding: 0 2rem;
                font-size: 0.88rem;
            }
            .row {
                padding: 0 1rem;
                margin-top: 1rem;
                img {
                    max-width: 414px;
                }
            }
            .btn {
                padding: 0 0.5rem;
                span {
                    margin: 0 0.25rem;
                    img {
                        max-width: 15rem;
                    }
                }
            }
            .rule {
                text-align: center;
                margin-top: 1rem;
                a {
                    text-decoration: none;
                    border-bottom: 1px solid #5d0f02;
                    margin: 0rem 0.5rem;
                    color: #5d0f02;
                }
            }
        }
    }
    .wrap-foot {
        position: relative;
        z-index: 0;
        width: 90%;
        margin: -1rem 5% 2rem;
        // transform: translateY(-3.8rem);
        .share {
            text-align: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%);
            width: 11.31rem;
        }
    }
    .divider {
        text-align: center;
    }
    .box-head {
        z-index: 1;
        position: relative;
        width: 90%;
        margin: 0 5%;
        background: url('../../assets/images/box-body.png') center repeat-y;
        background-size: contain;
        .box-title {
            margin: 0.5rem 0 0.5rem;
            &.first {
                margin-top: -2.5rem;
            }
            .title {
                margin: 0rem 0.5rem;
                font-size: 1.25rem;
                .red {
                    color: #eb241b;
                }
            }
        }
        .log-box {
            margin: 0 0 1rem;
            border-radius: 15px;
            ul {
                list-style: none;
                padding: 0;
                li {
                    height: 2rem;
                    font-size: 0.75rem;
                }
            }
            &-wrap {
                margin-left: 1.5rem;
            }
            .u-avatar {
                height: 2rem;
                width: 2rem;
                line-height: 2rem;
                border-radius: 50%;
                text-align: center;
                margin: 0 0 0 0.5rem;
                position: relative;
            }
            .u-log {
                // padding-left: 1.5rem;
                .uname {
                    max-width: 3rem;
                    padding-right: 0.5rem;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .uhelp {
                    padding-right: 0.5rem;
                }
                .money {
                    font-size: 1rem;
                    padding-left: 0.5rem;
                }
            }
        }
        .my-tip {
            text-align: center;
            font-size: 0.88rem;
            margin-top: 0.63rem;
            &.cash {
                color: #096d61;
                padding: 0 1rem;
            }
        }
    }
    .box-foot {
        position: relative;
        z-index: 0;
        width: 90%;
        margin: -1rem 5% 2rem;
        // transform: translateY(-3.8rem);
    }
}
@media screen and (max-width: 320px) {
    .content {
        height: 23rem !important;
    }
    .log-box-wrap {
        margin-left: 0.5rem !important;
    }
    .u-log {
        .money {
            font-size: inherit !important;
            padding-left: 0.25rem !important;
        }
    }
}
@media screen and (max-width: 414px) and (min-width: 376px) {
    .content {
        height: 28rem !important;
    }
}
@media screen and (min-width: 768px) {
    .content {
        height: 40rem !important;
    }
}
</style>
