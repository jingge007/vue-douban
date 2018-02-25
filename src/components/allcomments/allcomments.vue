<!--全部展示短评和影评的组件-->
<template>
  <div class="allcomments">
    <div class="fixed-title">
      <span class="back" @click="back">
        <i class="icon-back"></i>
      </span>
      <span class="type">{{title}}</span>
      <span class="to-top" @click="toTop">
        <i class="icon-circle-up"></i>
      </span>
    </div>
    <scroll class="all-discuss"
            ref="scroll"
            :data="discussion"
            @scrollToEnd="loadMore"
            :pullup="pullup"
    >
      <div class="discuss-content">
        <!--电影全部短评-->
        <moviecomment v-if="reviewsType === 'comments'"
                      :needTitle="needTitle"
                      :comments="discussion"
                      :commentNum="discussionNum"
                      :hasMore="hasMore"
        ></moviecomment>
        <!--电影全部影评-->
        <moviereview v-else
                     :reviews="discussion"
                     :reviewsNum="discussionNum"
                     :needTitle="needTitle"
                     :hasMore="hasMore"
                     @selectReview="selectReview"
        ></moviereview>
      </div>
      <loading v-if="!discussion.length && !noResult" :fullScreen="fullScreen"></loading>
      <div class="no-result" v-if="noResult">暂无评论的数据...</div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  import scroll from 'base/scroll/scroll.vue'
  import loading from 'base/loading/loading.vue'
  import {getAllComments, getAllReviews} from 'api/moviedetail.js'
  import moviecomment from 'components/moviecomment/moviecomment.vue'
  import moviereview from 'components/moviereview/moviereview.vue'

  const SEARCH_MORE = 20            // 电影评价每次加载的数据量

  export default {
    data() {
      return {
        discussionIndex: 0,        // 电影评论条数的索引
        discussion: [],
        discussionNum: 0,
        pullup: true,            // 支持上拉加载更多数据
        hasMore: true,           // 还有更多的数据
        noResult: false
      }
    },
    created() {
      this.fullScreen = true             // 没有数据的时候开启全屏加载
      this.needTitle = true
      this.loadingFlag = true            // 控制滚动加载速度
      this._getAlldiscussion()
    },
    computed: {
      ...mapGetters(['movie', 'reviewsType']),           // 获取电影的信息和电影的评价类型
      title() {                                 // 电影的标题
        return `${this.movie.title}的全部${this.type}`
      },
      type() {
        return this.reviewsType === 'comments' ? '短评' : '影评'
      }
    },
    methods: {
      ...mapMutations({setReview: 'SET_REVIEWS_ID'}),            // 将电影影评的列表ID提交到Mutation中
      toTop() {                                    // 点击返回顶部
        this.$refs.scroll.scrollTo(0, 0, 500)
      },
      back() {                     // 点击做箭头返回上一层路由
        this.$router.back()
      },
      _getAlldiscussion() {                     // 获取电影评论的全部数据前，先判断要获取的电影评论类型
        if (!this.reviewsType) {               // 在当前浏览器刷新就跳转到上一页
          this.$router.push({
            path: `/moiveshow/${this.movie.id}`
          })
        }
        let movieType = this.reviewsType === 'comments'
        this.discussType = movieType ? 'comments' : 'reviews'
        this.getData = movieType ? getAllComments : getAllReviews
        this.getData(this.movie.id, this.discussionIndex, SEARCH_MORE).then((res) => {
          this.discussion = res[this.discussType]
          this.noResult = this.discussion.length ? this.noResult : true              // 是否存在全部的电影评论数据
          this.discussionNum = res.total
          this._checkMore(res)
          // console.log(res)
        })
      },
      _checkMore(data) {              // 检查是否还存在更多的数据
        const discussion = data.comments ? data.comments : data.reviews
        if (!discussion.length || data.start + data.count > data.total) {
          this.hasMore = false
        }
      },
      loadMore() {           // 全部电影评价列表上拉加载更多数据
        if (!this.loadingFlag || !this.hasMore) {             // 上一次加载还没有全部加载完成就返回
          return
        }
        this.loadingFlag = false             // 重置标志位
        this.discussionIndex += SEARCH_MORE
        this.getData(this.movie.id, this.discussionIndex, SEARCH_MORE).then((res) => {
          this.discussion = this.discussion.concat(res[this.discussType])
          this._checkMore(res)
          this.loadingFlag = true
        })
      },
      selectReview(id) {                   // 点击电影影评列表时，进入影评的详情页
        this.setReview(id)
        this.$router.push({
          path: `/moiveshow/${this.movie.id}/reviews/${id}`
        })
      }
    },
    components: {
      scroll,
      moviecomment,
      loading,
      moviereview
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "~@/common/stylus/mixin.styl"

  .allcomments {
    height: 100%
  }

  .allcomments .fixed-title {
    border-bottom-1px(#ccc)
    position fixed
    top: 0
    width: 100%
    height: 50px
    z-index 500
    background-color: #fff
  }

  .fixed-title .back {
    position absolute
    top: 0
    left: 6px
    z-index 150
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
    padding-left 50px
  }

  .fixed-title .to-top {
    position: absolute
    top: 0
    right 6px
    z-index 150
  }

  .to-top .icon-circle-up {
    display block
    padding 15px
    font-size 22px
    color #42bd56
  }

  .all-discuss {
    position: fixed
    top: 0
    bottom: 0
    right: 0
    left: 0
    z-index 250
    overflow hidden
    background-color: #fff
  }

  .all-discuss .discuss-content {
    padding-top: 50px
  }

  .no-result {
    position: absolute
    top: 50%
    width: 100%
    text-align center
    font-size 17px
    color: #0AAF0A
  }
</style>
