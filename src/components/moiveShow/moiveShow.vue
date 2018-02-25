<template>
  <div class="moiveshow">
    <!--头部搜索框-->
    <search @search="goSearch"></search>
    <!--正在热映与即将上映的开关切换组件-->
    <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
    <!--电影展示列表-->
    <div class="list-wrapper">
      <!--正在热映-->
      <scroll v-show="currentIndex===0"
              class="list-scroll"
              :data="moviehot"
              ref="moviehot"
              :pullup="pullup"
              @scrollToEnd="loadMore"
      >
        <div class="list-inner">
          <!--电影展示列表的组件-->
          <movielist :moviehot="moviehot" :hasMore="hotData" @select="selectMovie"></movielist>
        </div>
      </scroll>
      <!--即将上映-->
      <scroll v-show="currentIndex===1"
              class="list-scroll"
              :data="movieshow"
              ref="movieshow"
              :pullup="pullup"
              @scrollToEnd="loadMore"
              :probeType="probeType"
              :listenScroll="listenScroll"
              @scroll="scroll"
      >
        <div class="list-inner">
          <!--电影展示列表的组件-->
          <movielist :moviehot="movieshow"
                     :hasMore="showData"
                     ref="list"
                     :timeData="timeData"
                     @getHeight="getHeight"
                     @getMap="getMap"
                     @select="selectMovie"
          >
          </movielist>
        </div>
      </scroll>
      <loading
        :fullScreen="fullScreen"
        v-show="currentIndex===1 && !movieshow.length || currentIndex===0 && !moviehot.length">
      </loading>
    </div>
    <div class="list-fixed" ref="fixed" v-show="currentIndex===1" v-if="fixedTitle">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getMovieShow, getComingMovie} from 'api/movieShow.js'
  import {ERR_OK} from 'api/config'
  import switches from 'base/switches/switches.vue'
  import scroll from 'base/scroll/scroll.vue'
  import {createMovieList} from 'common/js/movielist.js'
  import movielist from 'components/movielist/movielist.vue'
  import loading from 'base/loading/loading.vue'
  import search from 'base/search/search.vue'
  import {mapMutations} from 'vuex'

  const SEARCH_MORE = 10         // 每次请求加载数据量
  const TITLE_HEIGHT = 30       // 定义在电影列表中显示日期栏的高度

  export default {
    data() {
      return {
        moviehot: [],              // 正在热映电影列表的数据组
        movieshow: [],            // 即将上映电影列表的数据组
        currentIndex: 0,
        hotData: true,          // 定义正在热映是否还有更多数据
        showData: true,        // 定义即将上映是否还有更多数据
        hotDataIndex: 0,      // 定义每次加载正在热映电影的数据量
        showDataIndex: 0,    // 定义每次加载即将上映电影的数据量
        switches: [
          {name: '正在热映'},
          {name: '即将上映'}
        ],
        pullup: true,           // 支持上拉加载更多数据
        timeData: true,         // 电影列表显示日期栏
        loadingFlag: true,      // 控制滚动加载速度
        scrollY: -1,
        diff: -1,
        fullScreen: true,        // 加载全屏动画
        scrollIndex: 0
      }
    },
    created() {
      this._getMovieShow()            // 调用获取正在热映的电影列表数据方法
      this.probeType = 3             // better-scroll插件派发滚动的事件方式
      this.listenScroll = true       // 监听better-scroll插件的滚动事件
      this.listHeight = []           // 定义各个滚动区域的高度
      this.scrollMap = []            // 定义滚动区域的分组
    },
    computed: {
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.scrollMap[this.scrollIndex] ? this.scrollMap[this.scrollIndex] : ''
      }
    },
    methods: {
      ...mapMutations({
        setMovie: 'SET_MOVIE'
      }),
      selectMovie(item) {         // 点击电影列表进入电影详情页并将数据提交到vuex的Mutations
        this.$router.push({
          path: `/moiveshow/${item.id}`
        })
        this.setMovie(item)
        //  console.log(item)
      },
      goSearch() {            // 点击电影列表搜索框进入搜索页面
        this.$router.push({
          path: `/search`
        })
      },
      _getMovieShow() {         // 获取正在热映电影的数据
        getMovieShow(this.hotDataIndex, SEARCH_MORE).then((res) => {
          if (res.start === ERR_OK) {
            this.$emit('hasLoad')                   // 当电影列表的数据请求成功后，派发hasLoad事件到APP.vue中
            this.moviehot = createMovieList(res.subjects)
            this._checkMore(res)          // 调用_checkMore方法检测列表中是否还有数据
            // console.log(this.moviehot)
          }
        })
      },
      switchItem(index) {              // 在切换电影上映的开关时，将子组件的index传给父组件
        this.currentIndex = index
        if (index === 1) {              // 当切换到即将上映时，重新计算各个区间的高度
          this.$refs.list.recalculate()
          this.$refs.movieshow.scrollTo(0, this.scrollY)     // 重新载入之前的滚动位置
        }
        setTimeout(() => {                // scroll组件计算高度，确保正确滚动
          this.$refs.moviehot.refresh()
          this.$refs.movieshow.refresh()
        }, 20)
        if (index === 1 && !this.movieshow.length) {        // 第一次切换到即将上映选项卡后开始请求即将上映电影的数据
          getComingMovie(this.showDataIndex, SEARCH_MORE).then((res) => {
            this.movieshow = createMovieList(res.subjects)
            this._checkMore(res)
          })
        }
      },
      loadMore() {       // 上拉电影列表加载更多数据
        if (!this.loadingFlag) {          // 判断列表在上次加载中是否已经完成，如果没有完成就返回
          return
        }
        this.loadingFlag = false         // 重置列表数据加载的标志位
        if (this.currentIndex === 0) {    // 加载更多正在热映的数据
          if (!this.hotData) {        // 当正在热映电影没有更多数据时，重置标志位并返回
            this.loadingFlag = true
            return
          }
          this.hotDataIndex += SEARCH_MORE
          getMovieShow(this.hotDataIndex, SEARCH_MORE).then((res) => {
            this.moviehot = this.moviehot.concat(createMovieList(res.subjects))        // concat() 方法用于连接两个或多个数组。
            this._checkMore(res)          // 调用_checkMore方法检测列表中是否还有数据
            this.loadingFlag = true
          })
        } else {
          if (!this.showData) {          // 当即将上映电影没有更多数据时，重置标志位并返回
            this.loadingFlag = true
            return
          }
          this.showDataIndex += SEARCH_MORE
          getComingMovie(this.showDataIndex, SEARCH_MORE).then((res) => {
            this.movieshow = this.movieshow.concat(createMovieList(res.subjects))
            this._checkMore(res)
            this.loadingFlag = true
          })
        }
      },
      _checkMore(data) {          // 监听数据列表中是否还有数据
        const movies = data.subjects
        if (!movies.length || data.start + data.count >= data.total) {
          if (this.currentIndex === 0) {
            this.hotData = false
          } else {
            this.showData = false
          }
          this.loadingFlag = true
        }
      },
      scroll(pos) {           // 获取滚动的位置
        this.scrollY = pos.y
      },
      getHeight(height) {               // 保存子组件传入的高度列表
        this.listHeight = height
        // console.log(height)
      },
      getMap(map) {              // 保存子组件传入的日期索引
        this.scrollMap = map
        // console.log(map)
      }
    },
    watch: {
      scrollY(newY, oldY) {
        if (!newY) {             // 如果在快速滚动时切换tab栏，滚动位置会读取错误，这里保留出错前正确的滚动位置
          this.scrollY = oldY
        }
        if (this.listHeight.length === 0 || this.scrollMap.length === 0) {           // 如果没有获取到高度就返回
          return
        }
        if (newY > 0) {          // 当滚动到顶部下拉时，newY>0
          this.scrollIndex = 0
          return
        }
        // 当在中间部分滚动时
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.scrollIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 滚动到底部，且newY大于最后一个元素的上限
        this.scrollIndex = this.listHeight.length - 2
      },
      diff(newVal) {
        let fixedtop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedtop === fixedtop) {
          return
        }
        this.fixedtop = fixedtop
        this.$nextTick(() => {
          this.$refs.fixed.style.transform = `translate3d(0,${fixedtop}px,0)`
        })
      }
    },
    components: {
      switches,
      scroll,
      movielist,
      loading,
      search
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .moiveshow {
    height: 100%
  }

  .list-wrapper {
    position: absolute
    top: 102px
    bottom: 61px
    width: 100%
  }

  .list-wrapper .list-scroll {
    position: relative
    height: 100%
    overflow: hidden
  }

  .list-wrapper .list-inner {
    padding 0px 15px
  }

  .list-fixed {
    position: absolute
    top: 102px
    right: 15px
    left: 15px
  }

  .list-fixed .fixed-title {
    width: 100%
    padding-left: 5px
    height: 30px
    line-height: 30px
    background-color: #eee
  }

</style>
