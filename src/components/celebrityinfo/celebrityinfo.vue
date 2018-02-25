<!--影人介绍简介组件-->
<template>
  <transition name="slide">
    <div class="celebrityinfo" v-show="showFlag">
      <div class="fixed-title">
        <span class="back" @click="close">
          <i class="icon-close"></i>
        </span>
        <span class="type">影人介绍</span>
      </div>
      <scroll class="celebrity-info" ref="scroll">
        <div class="scroll-wrapper">
          <h1 class="name">{{infoLists.name}}</h1>
          <h2 class="name-en">{{infoLists.name_en}}</h2>
          <div class="info-lists">
            <div class="gender">
              <span class="item">性别:</span>
              <span>{{infoLists.gender?infoLists.gender:'暂无信息'}}</span>
            </div>
            <div class="constellation">
              <span class="item">星座:</span>
              <span>{{infoLists.constellation?infoLists.constellation:'暂无信息'}}</span>
            </div>
            <div class="birthday">
              <span class="item">出生日期:</span>
              <span>{{infoLists.birthday?infoLists.birthday:'暂无信息'}}</span>
            </div>
            <div class="born-place">
              <span class="item">出生地:</span>
              <span>{{infoLists.born_place?infoLists.born_place:'暂无信息'}}</span>
            </div>
            <div class="more-name">
              <span class="item">更多中文名:</span>
              <span class="more">{{getNames(infoLists.aka)}}</span>
            </div>
          </div>
          <p class="summary">{{infoLists.summary}}</p>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
  import scroll from 'base/scroll/scroll.vue'

  export default {
    props: {
      infoLists: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        showFlag: false
      }
    },
    methods: {
      close() {                 // 关闭影人信息简介的对话框
        this.showFlag = false
      },
      show() {                  // 打开影人信息简介的对话框
        this.showFlag = true
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      },
      getNames(lists) {
        if (!lists || lists.length === 0 || lists[0] === '') {
          return '暂无信息'
        }
        return lists.join(' / ')
      }
    },
    components: {
      scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "~@/common/stylus/mixin.styl"

  .celebrityinfo {
    position: fixed
    top: 0
    width: 100%
    bottom: 0
    z-index 500
    background-color: #fff
  }

  .slide-enter-active, .slide-leave-active {
    transition all 0.3s
  }

  .slide-enter, .slide-leave-to {
    transform translate3d(-100%, 0, 0)
  }

  .celebrityinfo .fixed-title {
    position: fixed
    top: 0
    width: 100%
    height: 40px
    line-height: 40px
    z-index 100
    text-align center
    background-color: #fff;
    color #333
    border-bottom-1px(#09941F)
  }

  .fixed-title .back {
    position absolute
    top: 0
    right: 6px
    z-index 50
    /*border-radius 50%*/
    /*border 1px solid grey*/
  }

  .back .icon-close {
    display block
    padding: 11px
    font-size 18px
  }

  .celebrityinfo .type {
    display inline-block
    font-size 18px
  }

  .celebrity-info {
    position fixed
    top: 0
    width: 100%
    bottom: 0
  }

  .celebrityinfo .scroll-wrapper {
    padding 40px 20px 80px 20px
    color #333
  }

  .scroll-wrapper .name {
    margin-top: 30px
    font-size 18px
    font-weight 600
  }

  .scroll-wrapper .name-en {
    margin-top 10px
    font-size 12px
  }

  .scroll-wrapper .info-lists {
    padding 20px 0
    font-size 14px
  }

  .info-lists div {
    line-height: 25px
    font-size 0
  }

  .info-lists span {
    vertical-align middle
    font-size 14px
  }

  .info-lists .item {
    display inline-block
    width: 80px
  }

  .more-name {
    display flex
    align-items top
  }

  .more-name .item {
    flex 80px 0 0
    width: 80px
  }

  .more-name .more {
    flex 1
    no-wrap()
  }

  .summary {
    font-size 14px
    line-height: 24px
    text-indent 2em
  }
</style>
