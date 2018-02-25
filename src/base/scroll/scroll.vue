<!--better-scroll 滚动组件-->
<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {           // better-scroll插件派发滚动的事件方式
        type: Number,
        default: 1
      },
      click: {              // 是否支持点击事件
        type: Boolean,
        default: true
      },
      data: {
        default: null
      },
      scrollX: {        // 设置滚动的方向为X轴
        type: Boolean,
        default: false
      },
      listenScroll: {           // 是否要监听滚动事件
        type: Boolean,
        default: false
      },
      pullup: {           // 是否开启上拉刷新数据
        type: Boolean,
        default: false
      },
      beforeScroll: {           // 滚动开始时派发的事件
        type: Boolean,
        default: false
      },
      refreshDelay: {         // 控制刷新数据的延迟时间
        type: Number,
        default: 20
      },
      eventPassthrough: {        // 忽略滚动的方向
        type: String,
        default: ''
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    watch: {
      data() {          // 监听data数据的变化，重新计算滚动的高度
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          scrollX: this.scrollX,
          eventPassthrough: this.eventPassthrough
        })
        if (this.listenScroll) {             // 是否要监听滚动事件
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })
        }
        if (this.pullup) {         // 是否支持上拉刷新数据
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= this.scroll.maxScrollY + 50) {      // 快滚动到底部
              this.$emit('scrollToEnd')           // 派发事件说明已经滚动到底部了
            }
          })
        }
        if (this.beforeScroll) {              // 在触发之前派发事件，只要是用于用户体验优化
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      enable() {            // 启用 better-scroll，默认开启
        this.scroll && this.scroll.enable();
      },
      disable() {            // 禁用 better-scroll
        this.scroll && this.scroll.disable();
      },
      refresh() {             // 强制 scroll 重新计算，当 better-scroll 中的元素发生变化的时候调用此方法
        this.scroll && this.scroll.refresh();
      },
      scrollTo() {               // 滚动到某个位置，x,y 代表坐标，time 表示动画时间，easing 表示缓动函数
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },
      scrollToElement() {         // 滚动到某个元素，el（必填）表示 dom 元素，time 表示动画时间，offsetX 和 offsetY 表示坐标偏移量，easing 表示缓动函数
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>

</style>
