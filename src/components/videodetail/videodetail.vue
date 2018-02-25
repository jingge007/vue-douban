<!--电影预告片的详情页组件-->
<template>
  <div class="videodetail">
    <div class="fixed-title">
      {{videoData.title}}
      <span class="back" @click="back">
          <i class="icon-back"></i>
        </span>
    </div>
    <!-- 视频播放器-->

  </div>
</template>

<script>
  import {getMoviedetail} from 'api/moviedetail.js'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        videoData: {}
      }
    },
    created() {
      this._getMoviedetail()
    },
    computed: {
      ...mapGetters(['movie'])
    },
    methods: {
      back() {
        this.$router.back()
      },
      _getMoviedetail() {                 // 获取电影列表的详情页数据
        if (!this.movie.id) {             // 当在电影详情页刷新是强制回到电影展示页
          this.$router.push('/moiveshow')
          return
        }
        getMoviedetail(this.movie.id).then((res) => {
          this.videoData = res
        })
      },
      replaceUrl(url) {            // 图片防盗链处理,把现在的图片连接传进来，返回一个不受限制的路径
        return ('https://images.weserv.nl/?url=' + url.replace(/http\w{0,1}:\/\//, ''))
      }
    },
    components: {}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>

  .videodetail {
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    z-index 650
    background-color: #fff;
  }

  .fixed-title {
    height: 45px
    line-height: 45px
    font-size 16px
    text-align center
    color #fff
    position relative
    background-color: #4EE559
  }

  .fixed-title .back {
    position: absolute
    top: 0
    left: 6px
    z-index 60
  }

  .back .icon-back {
    padding 10px
    font-size 18px
    color #ffffff
  }
</style>
