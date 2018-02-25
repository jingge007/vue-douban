<!--全部作品列表的组件-->
<template>
  <transition name="works">
    <div class="CelebrityWorks">
      <div class="fixed-title">
      <span class="back" @click="back">
        <i class="icon-back"></i>
      </span>
        <span class="type">全部作品</span>
        <span class="to-top" @click="toTop">
        <i class="icon-circle-up"></i>
      </span>
      </div>
      <scroll class="celebrity-works" ref="scroll" :data="works" :pullup="pullup" @scrollToEnd="loadMore">
        <div class="scroll-wrapper">
          <ranklist :bottom="bottom" :rankItems="works" :needRank="needRank" :hasMore="hasMore" @select="selectMovie"></ranklist>
        </div>
      </scroll>
      <loading :fullScreen="fullScreen" v-if="!works.length"></loading>
    </div>
  </transition>
</template>

<script>
  import scroll from 'base/scroll/scroll.vue'
  import loading from 'base/loading/loading.vue'
  import {mapGetters, mapMutations} from 'vuex'
  import {getCelebrityWorks} from 'api/celebrity'
  import {createRankList} from 'common/js/movielist'
  import ranklist from 'components/ranklist/ranklist.vue'

  const SEARCH_MORE = 20          // 每次请求加载的条目的长度

  export default {
    data() {
      return {
        needRank: false,
        searchIndex: 0,
        fullScreen: true,
        hasMore: true,
        pullup: true,
        bottom: true,
        works: []
      }
    },
    computed: {
      ...mapGetters(['currentCelebrityId'])
    },
    created() {
      this.loadingFlag = true         // 控制滚动加载的速度
      this._getWorks()
    },
    methods: {
      ...mapMutations({
        setMovie: 'SET_MOVIE'
      }),
      back() {             // 点击返回上一层路由
        this.$router.back()
      },
      _getWorks() {             // 获取影人的全部作品数据
        if (!this.currentCelebrityId) {
          this.$router.push('/movieShow')
          return
        }
        getCelebrityWorks(this.currentCelebrityId, this.searchIndex, SEARCH_MORE).then((res) => {
          console.log(res)
          let ret = []
          res.works.forEach((item) => {
            ret.push(item.subject)
          })
          this.works = createRankList(ret)
          this._checkMore(res)
          // console.log(this.works)
        })
      },
      toTop() {                   // 返回顶部
        this.$refs.scroll.scrollTo(0, 0, 1000)
      },
      selectMovie(movie) {                 // 点击影人的全部作品列表进入电影的详情页
        this.setMovie(movie)
        this.$router.push({
          path: `/moiveshow/${movie.id}`
        })
      },
      loadMore() {           // 上拉列表加载更多数据
        if (!this.loadingFlag || !this.hasMore) {         // 如果上一次加载数据还没有完成就返回
          return
        }
        this.loadingFlag = false          // 重置滚动的标志位
        this.searchIndex += SEARCH_MORE
        getCelebrityWorks(this.currentCelebrityId, this.searchIndex, SEARCH_MORE).then((res) => {
          let ret = []
          res.works.forEach((item) => {
            ret.push(item.subject)
          })
          this.works = this.works.concat(createRankList(ret))
          this.loadingFlag = true
          this._checkMore(res)
        })
      },
      _checkMore(data) {            // 检测是否还有更多的数据
        let works = data.works
        if (!works.length || data.start + data.count >= data.total) {
          this.hasMore = false
        }
      }
    },
    components: {
      scroll,
      loading,
      ranklist
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "~@/common/stylus/mixin.styl"

  .CelebrityWorks {
    height: 100%
    position: relative
    z-index 800
    background-color: #fff;
  }

  .CelebrityWorks .fixed-title {
    border-bottom-1px(#ccc)
    position fixed
    top: 0
    width: 100%
    height: 50px
    z-index 200
    background-color: #fff
    text-align center
  }

  .fixed-title .back {
    position absolute
    top: 0
    left: 6px
    z-index 50
  }

  .back .icon-back {
    display block
    padding 15px
    font-size 18px
    color #42bd56
  }

  .fixed-title .type {
    line-height: 50px
    font-size 16px
  }

  .fixed-title .to-top {
    position absolute
    top: 0
    right: 6px
    z-index 50
  }

  .fixed-title .icon-circle-up {
    display block
    padding 15px
    font-size 22px
    color #42bd56
  }

  .celebrity-works {
    position absolute
    top: 0
    bottom: 0
    width: 100%
    background-color: #fff;
  }

  .scroll-wrapper {
    padding 50px 0 70px 0
  }

  .works-enter-active, .works-leave-active {
    transition all .3s
  }

  .works-enter, .works-leave-to {
    transform translate3d(-100%, 0, 0)
  }
</style>
