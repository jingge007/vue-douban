<!--启动页组件-->
<template>
  <transition name="move">
    <div class="startup">
      <div class="welcome">
        <div class="time" @click="timeItem">跳过 {{timer}}s</div>
        <div class="welcome-wrapper">
          <div class="smile">^_^</div>
          <div class="date">{{date}}</div>
          <div class="test">{{text}}</div>
        </div>
      </div>
      <div class="logo">
        <div class="logo-wrapper">
          <img src="./douban-logo.png" alt="" width="48" height="48">
          <div class="logo-desc">
            <span class="title">豆瓣</span>
            <span class="desc">我们的精神角落</span>
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
        text: '欢迎进入豆瓣电影',
        timer: 5,             // 默认的倒计时时间
        stop: false,       // 倒计时默认是停止
        interval: null
      }
    },
    props: {
      loadingFlag: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      date() {
        let now = new Date()
        const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        let currentWeek = week[now.getDay()]       // 获取当天的星期
        let year = now.getFullYear()         // 获取当前年份
        let month = now.getMonth() + 1      // 获取当前的月份
        let day = now.getDate()            // 获取当前的日
        return `${year}年${month}月${day}日  ${currentWeek}`
      }
    },
    created() {
      this.starTimer()
    },
    methods: {
      timeItem() {
        this.$emit('select')
        clearInterval(this.interval)
      },
      update() {
        if (this.timer < 2) {
          clearInterval(this.interval)
        } else {
          this.timer--
        }
      },
      starTimer() {
        if (this.stop === false) {
          this.interval = setInterval(this.update, 1000)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .startup {
    position fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index 9999
    background-color: #fff
  }

  .move-enter-active, .move-leave-active {
    transition: all 0.3s;
  }

  .move-enter, .move-leave-to {
    animation move .3s ease
  }

  .welcome {
    height: 70%
    width: 100%
    position: relative
  }

  .welcome .time {
    width: 80px
    height: 30px
    line-height: 30px
    text-align: center
    color #000
    position: absolute
    top 20px
    right 25px
    border-radius 80px
    background-color: rgba(217, 221, 232, .5)
  }

  .welcome .welcome-wrapper {
    position absolute
    top: 25%
    left: 50%
    transform translate(-50%, 0)
    text-align: center
    color #333
  }

  .welcome-wrapper .smile {
    color #06C512
    font-size 55px
    white-space nowrap
  }

  .welcome-wrapper .date {
    margin 30px 0 20px 0
    white-space nowrap
    font-size 16px
  }

  .welcome-wrapper .test {
    font-size 18px
  }

  .logo {
    height: 20%
  }

  .logo .logo-wrapper {
    position: relative
    top: 50%
    transform translateY(-50%)
    display flex
    align-items center
    justify-content center
    width: 60%
    margin 0 auto
  }

  .logo-wrapper img {
    flex 48px 0 0
    margin-right 15px
  }

  .logo-wrapper .logo-desc {
    height: 48px
    display flex
    flex-direction column
    justify-content space-around
  }

  .logo-desc .title {
    display: inline-block
    font-size 15px
    color #333
  }

  .logo-desc .desc {
    display: inline-block
    font-size 13px
  }

  @keyframes move {
    0% {
      opacity 1
      transform scale(1)
    }
    40% {
      opacity 0.6
      transform scale(0.7)
    }
    80% {
      opacity 0.4
      transform scale(0.4)
    }
    100% {
      opacity 0
      transform scale(0.1)
    }
  }
</style>
