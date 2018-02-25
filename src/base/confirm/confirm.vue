<!--删除提示框组件-->
<template>
  <transition name="fade">
    <div class="confirm" v-show="showFalg" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div @click="cancel" class="operate-btn left">{{cancelbtnText}}</div>
            <div @click="confirm" class="operate-btn">{{confirmbtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        showFalg: false
      }
    },
    props: {
      text: {
        type: String,
        default: ''
      },
      cancelbtnText: {
        type: String,
        default: '取消'
      },
      confirmbtnText: {
        type: String,
        default: '确定'
      }
    },
    methods: {
      show() {
        this.showFalg = true
      },
      hide() {
        this.showFalg = false
      },
      cancel() {
        this.hide()
        this.$emit('cancel')
      },
      confirm() {
        this.hide()
        this.$emit('confirm')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .confirm {
    position fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    background-color: rgba(0, 0, 0, 0.7)
  }

  .fade-enter-active {
    animation move 0.3s
  }

  .fade-leave-active {
    animation moveLeave 0.3s
  }

  .confirm-content {
    width: 270px
    border-radius 13px
    background-color: #fff
  }

  .confirm-wrapper {
    position: absolute
    top: 50%
    left: 50%
    transform translate(-50%, -50%)
    z-index 999
  }

  .confirm-content .text {
    padding 19px 15px
    line-height: 22px
    text-align center
    font-size 16px
    color #42bd56
  }

  .confirm-content .operate {
    display flex
    align-items center
    text-align center
    font-size 15px
    color #333
  }

  .confirm-content .operate-btn {
    flex 1
    line-height: 22px
    padding 10px 0
    border-top 1px solid #eee
  }

  .operate-btn.left {
    border-right 1px solid #eee
  }

  @keyframes move {
    0% {
      opacity 0
      transform scale(0.3)
    }

    100% {
      opacity 1
      transform scale(1)
    }
  }

  @keyframes moveLeave {
    0% {
      transform scale(1)
    }

    100% {
      opacity 0
      transform scale(0.3)
    }
  }
</style>
