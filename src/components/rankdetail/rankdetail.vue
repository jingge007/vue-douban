<!--电影排行的详情页组件-->
<template>
  <transition name="rank">
    <div class="rankdetail">
      <div class="fixed-title">
      <span class="back" @click="back">
       <i class="icon-back"></i>
      </span>
        <span class="type">
        <span>{{rankType}}</span>
      </span>
      </div>
      <switches :switches="switches"
                :smallFont="smallFont"
                v-if="rankType==='豆瓣 Top250'"
                :currentIndex="currentIndex"
                @switch="switchTab"
                class="switches"
      >
      </switches>
      <scroll class="rank-list-wrapper" ref="scroll"
              v-for="(item,index) in switches"
              :data=rankList[index]
              v-show="currentIndex===index"
              :pullup="pullup"
              :key="index"
              :probeType="probeType"
              @scrollToEnd="loadMore"
              @scroll="scroll"
      >
        <div class="rank-content" :class="{'more-padding':rankType==='豆瓣 Top250'}">
          <ranklist :rankItems="rankList[index]"
                    :page="index"
                    :hasMore="hasMore[index]"
                    @select="selectMovie"
          ></ranklist>
        </div>
        <loading :fullScreen="fullScreen" v-if="!rankList[index].length"></loading>
      </scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import switches from 'base/switches/switches.vue'
  import scroll from 'base/scroll/scroll.vue'
  import loading from 'base/loading/loading.vue'
  import {top250Rank, weeklyRank, usBoxRank, newMoviesRank} from 'api/movierank'
  import {createRankList} from 'common/js/movielist'
  import ranklist from 'components/ranklist/ranklist.vue'
  import {mapMutations} from 'vuex'

  const SEACH_MORE = 10

  export default {
    data() {
      return {
        rankType: '',
        dataFn: null,
        top250Index: 0,
        rankList: {},
        fullScreen: true,
        currentIndex: 0,
        switches: [
          {name: '1-50'},
          {name: '51-100'},
          {name: '101-150'},
          {name: '151-200'},
          {name: '201-250'}
        ],
        smallFont: true,                                         // tab栏目小字体
        pullup: true,                                           // 支持滚动加载
        hasMore: [false, false, false, false, false],          // 是否存在更多数据，仅针对top250
        movieIndex: [0, 50, 100, 150, 200],                   // 每页起始索引
        scrollY: [0, 0, 0, 0, 0]                             // 每页滚动位置
      }
    },
    created() {
      this.probeType = 3                 // 需要实时派发事件
      this.listenScroll = true           // 监听滚动事件
      this.loadingFlag = true            // 控制滚动加载速度
      this._selectType()
      this._getRankList()
    },
    beforeMount() {                   // 在挂载开始之前被调用：相关的render函数首次被调用。该钩子在服务器端渲染期间不被调用。
      // 由于top250榜单分栏的存在，需要添加排行列表的子对象作为各排名区间的数据
      // dom挂载前添加属性，防止挂载后由于属性未添加报错
      for (let i = 0; i < this.switches.length; i++) {
        this.$set(this.rankList, i, [])
      }
    },
    methods: {
      ...mapMutations({
        setMovie: 'SET_MOVIE'
      }),
      back() {                      // 返回上一层
        this.$router.back()
      },
      switchTab(index) {                     // 切换tab选项卡
        this.currentIndex = index
        this.loadingFlag = true
        this.$refs.scroll.forEach((item) => {               // 重新计算scroll
          item.scrollTo(0, this.scrollY[index])             // 滚动到之前的位置
          setTimeout(() => {
            item.refresh()
          }, 20)
        })
        if (this.rankList[index].length === 0) {                  // 首次切换到当前分页时
          this.hasMore[index] = true
          this.dataFn(this.movieIndex[index], SEACH_MORE).then((res) => {
            this.rankList[index] = createRankList(res.subjects)
          })
        }
      },
      selectMovie(movie) {                   // 点击列表电影今日电影详情页
        this.$router.push({
          path: `/moiveshow/${movie.id}`
        })
        this.setMovie(movie)
      },
      _selectType() {                                         // 获取排行榜的类型
        let type = this.$route.params.rankType               // 接收父组件传递过来的值
        switch (type) {                                     // 绑定对应信息获取函数
          case 'top250':
            this.dataFn = top250Rank
            this.rankType = '豆瓣 Top250'
            break
          case 'weekly':
            this.dataFn = weeklyRank
            this.rankType = '本周口碑榜'
            break
          case 'newmovie':
            this.dataFn = newMoviesRank
            this.rankType = '新片榜'
            break
          case 'usbox':
            this.dataFn = usBoxRank
            this.rankType = '北美票房榜'
            break
        }
      },
      _getRankList() {
        if (this.rankType !== '豆瓣 Top250') {           // 非top250榜单
          this.dataFn().then((res) => {
            this.rankList[0] = createRankList(res.subjects)
            // console.log(this.rankList[0])
          })
        } else {
          this.dataFn(this.movieIndex[0], SEACH_MORE).then((res) => {
            this.rankList[0] = createRankList(res.subjects)
            this.hasMore[0] = true
          })
        }
      },
      loadMore() {            // 上拉加载更多数据
        const index = this.currentIndex              // 获取当前分页页数
        if (!this.loadingFlag) {                     // 上一次加载还没有完成就返回
          return
        }
        this.loadingFlag = false                   // 重置标志位
        if (!this.hasMore[index]) {               // 如果没有更多数据就返回
          return
        }
        this.movieIndex[index] += SEACH_MORE
        this.dataFn(this.movieIndex[index], SEACH_MORE).then((res) => {
          this.rankList[index] = this.rankList[index].concat(createRankList(res.subjects))
          this.loadingFlag = true
          this._checkMore(res)
        })
      },
      _checkMore(data) {                   // 判断列表中是否还有更多的数据
        let movies = data.subjects
        let end = 50 * (this.currentIndex + 1)
        if (!movies.length || data.start + data.count >= end) {
          this.hasMore[this.currentIndex] = false
        }
      },
      scroll(pos) {
        this.scrollY[this.currentIndex] = pos.y
      }
    },
    components: {
      switches,
      scroll,
      loading,
      ranklist
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "~@/common/stylus/mixin.styl"

  .rankdetail {
    position fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    background-color: #fff;
    z-index 600
  }

  .rankdetail .switches {
    z-index 999
  }

  .rank-enter-active, .rank-leave-active {
    transition all .3s
  }

  .rank-enter, .rank-leave-to {
    transform translate3d(100%, 0, 0)
  }

  .rankdetail .fixed-title {
    border-bottom-1px(#ccc)
    position fixed
    top: 0
    width: 100%
    height: 50px
    z-index 980
    background-color: #fff;
  }

  .fixed-title .back {
    position absolute
    top: 0px
    left: 6px
    /*z-index 100*/
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
    padding-left 60px
    color #333
  }

  .switches {
    position fixed
    top: 50px
    width: 100%
    height: 40px
    z-index 250
    background-color: #fff
  }

  .rank-list-wrapper {
    z-index 900
    position fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    background-color: #fff;
  }

  .rank-content {
    padding 50px 15px 70px 15px
  }

  .rank-content.more-padding {
    padding-top: 90px
  }

</style>
