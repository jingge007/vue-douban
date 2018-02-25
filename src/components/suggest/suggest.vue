<!--搜索结果组件-->
<template>
  <div class="suggest-wrapper">
    <div class="to-top" v-show="result.length" @click="toTop">
      <span>返回顶部</span>
    </div>
    <scroll class="suggest"
            :data="result"
            :pullup="pullup"
            @scrollToEnd="searchMore"
            ref="suggest"
            @beforeScroll="listScroll"
            :beforeScroll="beforeScroll"
    >
      <div class="suggest-list clearfix">
        <div class="content-box clearfix">
          <!--左边电影列表-->
          <div class="suggest-left">
            <div class="suggest-item" v-for="item in evenData" @click="selectItem(item)">
              <img v-lazy="replaceUrl(item.image)" alt="">
              <div class="item-info">
                <div class="title">{{item.title}}</div>
                <div class="casts">{{item.casts}}</div>
                <star class="star" :size="24" :score="item.rating"></star>
                <span class="rating">{{getRating(item.rating)}}</span>
              </div>
            </div>
          </div>
          <!--右边电影列表-->
          <div class="suggest-right">
            <div class="suggest-item" v-for="item in oddData" @click="selectItem(item)">
              <img v-lazy="replaceUrl(item.image)" alt="">
              <div class="item-info">
                <div class="title">{{item.title}}</div>
                <div class="casts">{{item.casts}}</div>
                <star class="star" :size="24" :score="item.rating"></star>
                <span class="rating">{{getRating(item.rating)}}</span>
              </div>
            </div>
          </div>
        </div>
        <loading :hasMore="hasMore" v-if="result.length"></loading>
      </div>
      <div class="no-result" v-if="noResult">暂无搜索结果数据...</div>
      <loading :fullScreen="fullScreen" v-if="!result.length && !noResult"></loading>
    </scroll>
    <!-- <tab></tab>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import scroll from 'base/scroll/scroll.vue'
  import loading from 'base/loading/loading.vue'
  import {movieSearch, tagSearch} from 'api/moviesearch.js'
  import {createSearchList} from 'common/js/movielist.js'
  import star from 'base/star/star.vue'
  import {mapMutations} from 'vuex'
  // import tab from 'components/tab/tab.vue'

  const SEARCH_MORE = 10

  export default {
    data() {
      return {
        result: [],
        beforeScroll: true,
        searchIndex: 0,                 // 搜索列表的索引
        dataFn: null,                  // 区分关键词搜索和输入框搜索
        noResult: false,
        fullScreen: true,            // 支持全屏加载动画
        loadingFlag: true,          // 上拉加载更多数据的标志位
        pullup: true,              // 支持上拉加载更多数据
        hasMore: true,             // 还有更多数据
        oddData: [],
        evenData: []
      }
    },
    props: {
      query: {
        type: String,
        default: ''
      },
      tagSearch: {               // 关键词搜索
        type: Boolean,
        default: false
      }
    },
    created() {
      this._selectType()
      this.search()
    },
    watch: {
      query() {
        this._selectType()
        if (this.query) {            // 搜索框有数据时
          this.result = []          // 清空数据
          this.search()            // 获得检索数据
        }
      }
    },
    methods: {
      ...mapMutations({'setMovie': 'SET_MOVIE'}),
      toTop() {               // 返回顶部
        this.$refs.suggest.scrollTo(0, 0, 1000)
      },
      search() {
        this.result = []
        this.searchIndex = 0
        this.loadingFlag = true
        this.hasMore = true
        this.dataFn(this.query, this.searchIndex, SEARCH_MORE).then((res) => {
          const queryRet = res.title.split('"')
          if (this.query !== queryRet[1]) {                // 当搜索框里面搜索的数据和返回的数据不相同时就返回
            return
          }
          if (!res.subjects.length) {      // 判断是否存在搜索结果
            this.noResult = true
          } else {
            this.noResult = false
          }
          this.result = createSearchList(res.subjects)           // 对返回的数据进行处理
          this.result.findIndex((item, index) => {
            if (index % 2 !== 1) {       // 获取偶数行的数据
              this.evenData.push(item)
            } else {
              this.oddData.push(item)
            }
          })
          this._checkMore(res)
          // console.log(this.evenData)
          // console.log(this.oddData.length)
        })
      },
      searchMore() {               // 搜索结果加载更多数据
        if (!this.loadingFlag) {            // 如果上一次还没有完全加载完，就返回
          return
        }
        this.loadingFlag = false           // 重置标志位
        if (!this.hasMore) {             // 如果没有更多数据就返回
          return
        }
        this.searchIndex += SEARCH_MORE
        this.dataFn(this.query, this.searchIndex, SEARCH_MORE).then((res) => {
          this.result = this.result.concat(createSearchList(res.subjects))
          this.result.findIndex((item, index) => {
            if (index % 2 !== 1) {       // 获取偶数行的数据
              this.evenData.push(item)
            } else {
              this.oddData.push(item)
            }
          })
          this.loadingFlag = true
          this._checkMore(res)
        })
      },
      getRating(rate) {                 // 对电影评分数据的处理
        if (rate === 0) {
          return ''
        }
        return rate + '分'
      },
      _checkMore(data) {                // 判断是否还有更多数据
        let movie = data.subjects
        if (!movie.length || data.start + data.count >= data.total) {
          this.hasMore = false
        }
      },
      listScroll() {           // 列表滚动前派发事件，移动端搜索时，防键盘遮挡
        this.$emit('listScroll')
      },
      selectItem(item) {
        this.$router.push({
          path: `/moiveshow/${item.id}`
        })
        this.setMovie(item)            // 点击搜索结果列表时，将当前点击的列表数据提交到mutation中
        this.$emit('select')
      },
      _selectType() {                 // 先判断是通过关键词搜索还是通过输入框搜索
        this.dataFn = this.tagSearch ? tagSearch : movieSearch
      },
      replaceUrl(url) {            // 图片防盗链处理,把现在的图片连接传进来，返回一个不受限制的路径
        return ('https://images.weserv.nl/?url=' + url.replace(/http\w{0,1}:\/\//, ''))
      }
    },
    components: {
      scroll,
      loading,
      star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "~@/common/stylus/mixin.styl"

  .suggest-wrapper {
    height: 100%
    position: relative
  }

  .suggest-wrapper .to-top {
    box-sizing border-box
    height: 22px
    position: fixed
    right: 0
    top: 80%
    z-index: 900
    padding 5px
    background-color: #42bd56;
    color #fff
    text-align: center
    font-size 12px
  }

  .suggest {
    height: 100%
    overflow: hidden
  }

  .suggest .suggest-list {
    padding 15px 15px 75px 15px
  }

  .suggest .content-box {
    width: 100%
    padding-bottom 20px
  }

  .content-box .suggest-left {
    width: 48%
    float left
  }

  .content-box .suggest-right {
    width: 48%
    float right
  }

  .suggest-list .suggest-item {
    font-size 0
    width: 100%
    background-color: #f5f5f5
    margin-bottom 20px
  }

  .suggest-list .suggest-item img {
    width: 100%
    height: auto
  }

  .item-info .star {
    display inline-block
  }

  .suggest-item .title {
    width: 80%
    margin 0 auto
    font-size 15px
    color #333
    text-align center
    no-wrap()
  }

  .suggest-item .casts {
    width: 100%
    font-size 14px
    color #333
    text-align center
    no-wrap()
    margin 3px 0
  }

  .suggest .rating {
    margin-left 5px
  }

  .suggest-item .item-info {
    padding 8px 0
    text-align center
  }

  .suggest-item span {
    font-size 12px
  }

  .no-result {
    position: absolute
    top: 50%
    width: 100%
    text-align: center
    font-size 16px
    color #3CB611
  }
</style>
