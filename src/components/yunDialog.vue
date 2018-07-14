<template>
    <div class="yun-dialog">
        <x-dialog v-model="dialog.show" hide-on-blur :dialog-style="{ 'background-color': '#b92921', 'border-radius': '16px', 'overflow': 'visible' }">
            <div class="dialog-content" v-if="dialog.follow">
                <img src="../assets/images/qrcode.jpg" alt="qrcode" class="qrcode">
                <div class="desc">长按识别二维码， 关注孕云，{{followTip}}</div>
                <div class="btn" @click="dialog.show = false; dialog.follow = false;">知道了</div>
            </div>
            <div class="dialog-content" v-if="dialog.share">
                <div class="desc wide">点击右上角的按钮，选择发送给好友或分享至朋友圈</div>
                <div class="btn" @click="dialog.show = false; dialog.share = false;">知道了</div>
            </div>
            <div class="dialog-content" v-if="dialog.win">
                <img src="../assets/images/win.png" alt="" class="topic">
                <div class="desc large">中奖{{win}}元!</div>
                <div class="desc wide">帮助别人解锁有机会获得奖励哦！</div>
                <div class="desc wide">领奖方式参见活动规则！</div>
                <div class="btn" @click="dialog.show = false; dialog.win = false;">知道了</div>
            </div>
            <div class="dialog-content" v-if="dialog.miss">
                <img src="../assets/images/miss.png" alt="" class="topic">
                <div class="desc large">再接再励!</div>
                <div class="desc wide">帮助别人解锁有机会获得奖励哦！</div>
                <div v-show="dialog.bindable" class="desc wide">小窍门：绑定手机号，下一次可提高中奖概率</div>
                <div class="btn" :class="{ 'double': dialog.bindable }" flex="main:center cross:center box:mean">
                    <span @click="dialog.show = false; dialog.miss = false;">知道了</span>
                    <span v-show="dialog.bindable" @click="dialog.miss = false; dialog.bind = true">去绑定</span>
                </div>
            </div>
            <div class="dialog-content" v-if="dialog.bind">
                <div class="desc large">绑定手机号</div>
                <div class="field" flex="main:center cross:center">
                    <input v-model="form.phone" placeholder="请输入手机号" maxlength="11">
                </div>
                <div class="field" flex="main:center cross:center box:last">
                    <input v-model="form.code" placeholder="验证码" maxlength="6">
                    <span class="action" @click="getCode">
                        <countdown v-if="cooldown" :time="cooldown * 1000" @countdownend="cooldown = 0" :leading-zero="false">
                            <template slot-scope="props">重新发送{{ props.seconds || 60 }}s</template>
                        </countdown>
                        <span v-else>获取验证码</span>
                    </span>
                </div>
                <div class="btn double" flex="main:center cross:center box:mean">
                    <span @click="dialog.show = false; dialog.bind = false;">取消</span>
                    <span :class="{ 'disabled': !form.phone || !form.code }" @click="bind">确定</span>
                </div>
            </div>
        </x-dialog>
    </div>
</template>

<script>
import {
    XDialog
    // TransferDomDirective as TransferDom
} from 'vux'
import { doAction, getVerifyCode } from '@/services/api'
import countdown from '@xkeshi/vue-countdown'
import { cookie } from 'vux'

export default {
    name: 'yun-dialog',
    // directives: {
    //     TransferDom
    // },
    components: {
        XDialog,
        countdown
    },
    props: {
        dialog: {
            type: Object,
            default: {
                show: false,
                follow: false,
                share: false,
                win: false,
                miss: false,
                bind: false,
                bindable: true
            }
        },
        win: {
            type: Number,
            default: 0
        },
        openId: String,
        followTip: {
            type: String,
            default: '重新打开活动链接参加活动'
        }
    },
    data() {
        return {
            loading: false,
            form: {
                phone: '',
                code: ''
            },
            cooldown: 0
        }
    },
    // computed: {
    //     btnText() {
    //         return this.cooldown > 0
    //             ? `重新发送(${this.cooldown}s)`
    //             : '获取验证码'
    //     }
    // },
    mounted() {
        const time = cookie.get('smslogtime')
        const now = Date.now()
        if (time && time > now) {
            const left = Math.min(Math.floor((time - now) / 1000), 60)
            this.startCooldown(left)
        }
    },
    methods: {
        async getCode() {
            if (this.loading) return
            if (this.cooldown > 0) return
            if (!this.form.phone) return
            this.loading = true
            try {
                const { data } = await getVerifyCode({
                    phone: this.form.phone,
                    type: 'login'
                })
                this.startCooldown()
            } catch (err) {
                console.dir(err)
                let reason = err.message
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.reason
                ) {
                    reason = err.response.data.reason
                }
                if (reason.indexOf('用户已注册') > -1) {
                    await this.getCodeAgain()
                } else {
                    this.$vux.alert.show({
                        // title: '操作提示',
                        content: reason || '获取验证码失败，请稍后再试！'
                    })
                }
            }
            this.loading = false
        },
        async getCodeAgain() {
            try {
                const { data } = await getVerifyCode({
                    phone: this.form.phone,
                    type: 'restpwd'
                })
                this.startCooldown()
            } catch (err) {
                console.dir(err)
                let reason = err.message
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.reason
                ) {
                    reason = err.response.data.reason
                }
                this.$vux.alert.show({
                    // title: '操作提示',
                    content: reason || '获取验证码失败，请稍后再试！'
                })
            }
        },
        startCooldown(wait = 60) {
            const now = Date.now()
            const expires = new Date()
            expires.setTime(now + 30 * 60 * 1000)
            cookie.set('smslogtime', now + wait * 1000, {
                expires
            })
            this.cooldown = wait
            // this.tikTok()
        },
        // tikTok() {
        //     this.cooldown--
        //     if (this.cooldown > 0) {
        //         setTimeout(() => {
        //             this.tikTok()
        //         }, 1000)
        //     }
        // },
        async bind() {
            if (this.loading) return
            if (!this.form.phone || !this.form.code) return
            this.loading = true
            try {
                const { data } = await doAction({
                    actionCfgId: '-1',
                    keyType: 'openId',
                    openId: this.openId,
                    data: {
                        phone: this.form.phone,
                        veriCode: this.form.code
                    }
                })
                this.$vux.alert.show({
                    // title: '操作提示',
                    content: '绑定失败，请稍后再试！'
                })
            } catch (err) {
                console.dir(err)
                let reason = err.message
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.reason
                ) {
                    reason = err.response.data.reason
                }
                if (reason.indexOf('活动环节不存在') > -1) {
                    this.$emit('user-bind')
                } else {
                    this.$vux.alert.show({
                        // title: '操作提示',
                        content: reason || '绑定失败，请稍后再试！'
                    })
                }
            }
            this.loading = false
        }
    }
}
</script>

<style lang="less" scoped>
.dialog-content {
    color: #ffe0c3;
    text-align: center;
    padding-top: 3.13rem;
    .qrcode {
        width: 9.5rem;
        margin: 0 auto 0.63rem;
    }
    .topic {
        width: 16.13rem;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -60%);
        pointer-events: none;
    }
    .desc {
        font-size: 0.88rem;
        padding: 0 4rem;
        &.wide {
            padding: 0.5rem 2rem 1rem;
        }
        &.large {
            font-size: 1.25rem;
            padding: 0;
            margin: -1rem 0 0.5rem;
        }
    }
    .field {
        padding: 0.5rem 1.19rem;
        position: relative;
        &:nth-child(3) {
            margin-bottom: 2rem;
        }
        input {
            width: 100%;
            border: none;
            border-radius: 6px;
            padding: 1rem;
            outline: none;
            font-size: 1.13rem;
            &::-webkit-input-placeholder {
                color: #5d0f02;
            }
        }
        .action {
            margin: 0 1rem;
        }
    }
    .btn {
        font-size: 1.13rem;
        border-top: 1px solid rgba(240, 239, 247, 0.38);
        margin: 1.19rem 1.25rem 0;
        padding: 1.25rem 0;
        &.double {
            padding: 1rem 0;
            span {
                padding: 0.25rem;
                &:last-child {
                    border-left: 1px solid rgba(240, 239, 247, 0.38);
                }
                &.disabled {
                    opacity: 0.66;
                }
            }
        }
    }
}
</style>
