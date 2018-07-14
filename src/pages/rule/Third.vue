<template>
    <div id="rule">
        <div class="header">
            <img width="100%" src="../../assets/images/bg-head.png" alt="">
        </div>
        <div class="wrap">
            <img class="lion" width="100%" src="../../assets/images/lion.png" alt="">
            <div class="wrap-lion">
                <div class="wrap-head">
                    <img class="wrap-head-top" width="100%" src="../../assets/images/wrap-head.png" alt="">
                    <div class="content">
                        <div class="box-title" flex="main:center cross:center">
                            <span class="wrap-wing"></span>
                            <span class="title">活动说明</span>
                            <span class="wrap-wing"></span>
                        </div>
                        <p class="row">1.参与对象：所有关注孕云公众号的用户都可参与</p>
                        <p class="row">2.活动时间：<span class="red">2018.3.2 17:00 - 2018.3.7 17:00</span></p>
                        <p class="row">3.奖金发放时间：<span class="red">2018.3.8 10:30</span></p>
                        <p class="row">4.活动奖品：<span class="red">0.08~8.88元现金红包</span></p>
                        <p class="row">5.活动规则：</p>
                        <p class="row">• 活动期间，每人默认有1次抽奖机会，邀请好友帮助解锁可以获得额外的抽奖机会（一位好友仅可帮助解锁一次），每人最多有6次抽奖机会。</p>
                        <p class="row">• 帮助好友解锁有机会获得额外奖励</p>
                        <p class="row">• 获奖金额自动累计，并于指定时间通过孕云公众号统一发放，获奖用户按照孕云公众号内消息提示领取现金红包，领取成功后，红包自动存入微信零钱。</p>
                        <p class="row">6.温馨提示：</p>
                        <p class="row">• 根据微信公众号现金红包规则，每位用户累计金额要大于1元才能收到红包。</p>
                        <p class="row">• 微信红包领取有效期为24小时，过期作废。</p>
                        <p class="row">• 用户若因取消关注公众号导致收取红包失败，不予补发。</p>
                        <p class="row confirm">活动最终解释权归孕云所有</p>
                        <div class="link" @click="back">
                            <a href="javascript:void(0);">我知道了</a>
                        </div>
                    </div>
                </div>
                <div class="wrap-foot">
                    <img width="100%" src="../../assets/images/wrap-foot.png" alt="">
                </div>
            </div>
            <div class="wrap-lion-tail">
                <img width="100%" src="../../assets/images/lion-tail.png" alt="">
            </div>
        </div>
        <div class="footer">
            孕云 · 希望天下妈妈幸福
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        back() {
            window.history.back()
        }
    }
}
</script>

<style lang="less" scoped>
#rule {
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
            .box-title {
                margin: -2rem 0 0.5rem;
                .title {
                    margin: 0rem 0.5rem;
                    font-size: 1.13rem;
                }
            }
            .row {
                padding: 5px 1rem;
                font-size: 0.88rem;
                .red {
                    color: #eb241b;
                }
                &.confirm {
                    text-align: center;
                    margin-top: 1.88rem;
                }
            }
            .link {
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
    }
}
</style>
