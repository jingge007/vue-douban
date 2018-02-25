<template>
  <transition name="fade">
    <div class="moviedetail">
      <div class="fixed-title">
        <span class="back" @click="back">
          <i class="icon-back"></i>
        </span>
        <span class="type" ref="fixed">
          <span class="icon" v-show="!this.changeFix">
            <i class="icon-video-camera"></i>电影
          </span>
          <span class="movie-name" v-if="changeFix" v-text="moviedetail.title"></span>
        </span>
      </div>
      <scroll class="movie-detail"
              :data="moviedetail"
              :probeType="probeType"
              :listenScroll="listenScroll"
              ref="scroll"
              @scroll="scroll"
      >
        <div class="scroll-wrapper">
          <div class="scroll-content" v-if="moviedetail.images">
            <div class="bg-image" ref="image">
              <img v-lazy="replaceUrl(moviedetail.images.large)" alt="">
            </div>
            <!--详情页电影信息的组件-->
            <movieinfo :moviedetail="moviedetail" @selectCelebrity="selectCelebrity"></movieinfo>
            <div class="switch">
              <!--电影详情页短评和影评的tab栏切换-->
              <switches :switches="switches" :currentIndex="currentIndex" @switch="selectItem"></switches>
            </div>
            <!--电影详情页的短评-->
            <moviecomment v-show="currentIndex===0"
                          :comments="moviedetail.popular_comments"
                          :commentNum="moviedetail.comments_count"
                          @needAllComments="needAllComments"
            ></moviecomment>
            <!--电影详情页的影评-->
            <moviereview v-show="currentIndex===1"
                         :reviews="moviedetail.popular_reviews.slice(0,5)"
                         :reviewsNum="moviedetail.reviews_count"
                         @needAllReviews="needAllReviews"
                         @selectReview="selectReview"
            ></moviereview>
          </div>
        </div>
        <loading :fullScreen="fullScreen" v-show="!moviedetail.images"></loading>
      </scroll>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import scroll from 'base/scroll/scroll.vue'
  import switches from 'base/switches/switches.vue'
  import {getMoviedetail} from 'api/moviedetail.js'
  import movieinfo from 'components/movieinfo/movieinfo.vue'
  import moviecomment from 'components/moviecomment/moviecomment.vue'
  import moviereview from 'components/moviereview/moviereview.vue'
  import {mapGetters, mapMutations} from 'vuex'
  import loading from 'base/loading/loading.vue'

  export default {
    name: 'moviedetail',            // 创建name属性用于keep-alive组件定位本组件防止缓存
    data() {
      return {
        moviedetail: {},
        fullScreen: true,          // 用于loading组件全屏加载效果
        switches: [
          {name: '短评'},
          {name: '影评'}
        ],
        currentIndex: 0,
        scrollY: -1,
        imgHeight: -1,
        changeFix: false             // fix栏目图标的显示隐藏
      }
    },
    created() {
      this._getMoviedetail()
      this.probeType = 3          // scroll组件需要实施派发scroll事件，且支持swipe
      this.listenScroll = true    // scroll组件监听scroll事件并派发滚动位置
    },
    computed: {
      ...mapGetters(['movie'])                 // 获取储存在vuex中的数据
    },
    methods: {
      ...mapMutations({                       // 将需要的数据提交到vuex中
        setMovieType: 'SET_REVIEWS_TYPE',
        setReview: 'SET_REVIEWS_ID',
        setCelebrity: 'SET_CELEBRITY_ID'
      }),
      back() {                 // 点击返回上一层路由
        this.$router.back()
      },
      _getMoviedetail() {                 // 获取电影列表的详情页数据
        if (!this.movie.id) {             // 当在电影详情页刷新是强制回到电影展示页
          this.$router.push('/moiveshow')
          return
        }
        getMoviedetail(this.movie.id).then((res) => {
          this.moviedetail = res
          // console.log(res)
        })
      },
      selectItem(index) {             // 切换电影详情页的评论tab栏
        this.currentIndex = index
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      },
      needAllComments() {                 // 点击全部短评时，进入全部短评的界面
        this.setMovieType('comments')       // 将‘comments’提交到vuex的mutation中
        this.$router.push({
          path: `/moiveshow/${this.moviedetail.id}/comments`
        })
      },
      needAllReviews() {                // 点击全部短评时，进入全部影评的界面
        this.setMovieType('reviews')       // 将‘reviews’提交到vuex的mutation中
        this.$router.push({
          path: `/moiveshow/${this.moviedetail.id}/reviews`
        })
      },
      selectReview(id) {                   // 点击电影影评列表时，进入影评的详情页
        this.setReview(id)
        this.$router.push({
          path: `/moiveshow/${this.movie.id}/reviews/${id}`
        })
      },
      scroll(pos) {
        this.scrollY = pos.y
        if (-this.imgHeight > pos.y && this.imgHeight !== -1) {
          this.changeFix = true                 // 改变fixed栏文字
        } else {
          this.changeFix = false
        }
      },
      selectCelebrity(id) {
        this.setCelebrity(id)
        this.$router.push({
          path: `/clebrity/${id}`
        })
      },
      replaceUrl(url) {            // 图片防盗链处理,把现在的图片连接传进来，返回一个不受限制的路径
        return ('https://images.weserv.nl/?url=' + url.replace(/http\w{0,1}:\/\//, ''))
      }
    },
    components: {
      scroll,
      movieinfo,
      switches,
      moviecomment,
      moviereview,
      loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .moviedetail {
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: #fff
    z-index 222
  }

  .fade-enter-active {
    animation move 0.3s
  }

  /*.fade-leave-active {
    transition all 0.3s
  }*/

  .fade-leave-to {
    transition all 0.3s
    transform translate3d(-100%, 0, 0)
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

  .fixed-title {
    position fixed
    top: 0
    width: 100%
    height: 40px
    line-height: 40px
    z-index 100
    background-color: #4EE559
    text-align: center
    /*margin-bottom 40px*/
  }

  .fixed-title .back {
    position: absolute
    top 0
    left: 6px
    z-index 60
  }

  .back .icon-back {
    display block
    padding: 10px
    font-size 18px
    color #fff
  }

  .fixed-title .type .icon {
    position: absolute
    left: 50%
    top: 0
    color #fff
    display: block
    font-size 18px
    transform translateX(-50%)
  }

  .icon .icon-video-camera {
    margin-right 10px
    display inline-block
    vertical-align text-bottom
    font-size 23px
  }

  .type .movie-name {
    display: block
    padding-top 11px
    width: 100%
    color #fff
  }

  .movie-detail {
    position fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    background-color: #555
  }

  .movie-detail .bg-image {
    text-align center
    width: 100%;
    padding: 60px 0 20px 0
    font-size 0
  }

  .bg-image img {
    width: 50%
  }

  .switch {
    padding 0 20px
    background-color: #fff;
    padding-top 20px
  }
</style>
