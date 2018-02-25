<!--电影预告片组件-->
<template>
  <div class="video">
    <div class="fixed-title">电影预告片</div>
    <scroll class="center"
            ref="scroll"
            :data="videoData"
            @scrollToEnd="loadMore"
            :pullup="pullup"
            :probeType="probeType"
    >
      <div class="video-box clearfix">
        <div class="clearfix box-videos">
          <!--左边的列表-->
          <div class="item-left">
            <div class="video-item" @click="videoSelect(item)" v-for="item in evenData">
              <img v-lazy="replaceUrl(item.image)" alt="">
              <p class="title">{{item.title}}</p>
              <star :size="24" :score="item.rating" :showScore="showScore" class="star"></star>
            </div>
          </div>
          <!--右边的列表-->
          <div class="item-right">
            <div class="video-item" @click="videoSelect(item)" v-for="item in oddData">
              <img v-lazy="replaceUrl(item.image)" alt="">
              <p class="title">{{item.title}}</p>
              <star :size="24" :score="item.rating" :showScore="showScore" class="star"></star>
            </div>
          </div>
        </div>
        <loading :hasMore="hasMore" v-show="videoData.length"></loading>
      </div>
    </scroll>
    <loading :fullScreen="fullScreen" v-if="!videoData.length"></loading>
    <router-view></router-view>
  </div>
</template>

<script>
  import scroll from 'base/scroll/scroll.vue'
  import {getComingMovie} from 'api/movieShow.js'
  import {createMovieList} from 'common/js/movielist.js'
  import {ERR_OK} from 'api/config'
  import loading from 'base/loading/loading.vue'
  import star from 'base/star/star.vue'
  import {mapMutations} from 'vuex'

  const VIDEO_MORE = 20        // 每次请求加载数据量

  export default {
    data() {
      return {
        videoData: [],
        oddData: [],
        evenData: [],
        fullScreen: true,
        showScore: true,
        videoIndex: 0,
        loadingFlag: true,
        hasMore: true,
        pullup: true,
        probeType: 3
      }
    },
    created() {
      this._getComingMovies()
    },
    methods: {
      ...mapMutations({
        setMovie: 'SET_MOVIE'
      }),
      _getComingMovies() {
        getComingMovie(this.videoIndex, VIDEO_MORE).then((res) => {
          if (res.start === ERR_OK) {
            this.videoData = createMovieList(res.subjects)
          }
          this.videoData.findIndex((item, index) => {
            if (index % 2 !== 1) {       // 获取偶数行的数据
              this.evenData.push(item)
            } else {
              this.oddData.push(item)
            }
          })
          this._checkMore(res)
        })
      },
      videoSelect(item) {                // 点击电影预告片列表进入电影预告片的详情页
        this.setMovie(item)
        this.$router.push({
          path: `/video/${item.id}`
        })
      },
      replaceUrl(url) {            // 图片防盗链处理,把现在的图片连接传进来，返回一个不受限制的路径
        return ('https://images.weserv.nl/?url=' + url.replace(/http\w{0,1}:\/\//, ''))
      },
      loadMore() {
        if (!this.loadingFlag) {
          return
        }
        this.loadingFlag = false
        if (!this.hasMore) {           // 没有更多数据时，返回
          this.loadingFlag = true
          return
        }
        this.videoIndex += VIDEO_MORE
        getComingMovie(this.videoIndex, VIDEO_MORE).then((res) => {
          this.videoData = this.videoData.concat(createMovieList(res.subjects))
          this.videoData.findIndex((item, index) => {
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
      _checkMore(data) {
        let videos = data.subjects
        if (!videos.length || data.start + data.count > data.total) {
          this.hasMore = false
        }
        this.loadingFlag = true
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

  .video {
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index 300
    background-color: #fff
  }

  .fixed-title {
    position: fixed;
    top: 0;
    width: 100%;
    height: 45px;
    line-height: 45px
    z-index: 400;
    background-color: #4EE559;
    text-align center
    color #fff
    font-size 16px
  }

  .center {
    position: absolute
    top: 55px
    bottom: 70px
    overflow: hidden
    box-sizing border-box
    width: 100%
  }

  .video-box {
    padding 0 10px
    text-align center
  }

  .video-box .item-left, .video-box .item-right {
    box-sizing border-box
    width: 49%
  }

  .video-box .item-left {
    float left
  }

  .video-box .item-right {
    float right
  }

  .video-item {
    text-align: center
    margin-bottom 15px
    background-color: #F5F5F5
  }

  .video-item img {
    width: 100%
    vertical-align: top
  }

  .video-item .title {
    margin-top 8px
    font-size 15px
    color #000000
    line-height: 25px
    no-wrap()
  }

  .video-item .star {
    line-height: 25px
  }

  .box-videos {
    padding-bottom: 20px
  }
</style>

