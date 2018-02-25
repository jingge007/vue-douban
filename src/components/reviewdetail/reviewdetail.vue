<!--电影影评的详情页组件-->
<template>
  <div class="reviewdetail">
    <div class="fixed-title">
      <span class="back" @click="back">
        <i class="icon-back"></i>
      </span>
      <span class="type">影评</span>
    </div>
    <scroll class="review-detail" :data="reviewdetail">
      <div class="scroll-wrapper">
        <div class="review-content" v-if="reviewdetail.author">
          <h1 class="title">{{reviewdetail.title}}</h1>
          <div class="author">
            <div class="avatar">
              <img v-lazy="reviewdetail.author.avatar" alt="" height="36" width="36">
            </div>
            <div class="info">
              <h2>
                <span class="name">{{reviewdetail.author.name}}</span>的影评
              </h2>
              <span class="date">{{reviewdetail.created_at}}</span>
              <star :size="24" :score="reviewdetail.rating.value*2" class="star"></star>
            </div>
          </div>
          <p class="desc" v-html="reviewdetail.content"></p>
          <div class="copyright">本文版权归{{reviewdetail.author.name}}所有，任何形式转载请联系作者</div>
          <div class="end">
            <div class="line"></div>
            <span class="text">THE END</span>
          </div>
          <div class="useful">
            <div class="use">有用{{reviewdetail.useful_count}}</div>
            <div class="no-use">没用{{reviewdetail.useless_count}}</div>
          </div>
        </div>
      </div>
      <loading :fullScreen="fullScreen" v-if="!reviewdetail.author"></loading>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import loading from 'base/loading/loading.vue'
  import scroll from 'base/scroll/scroll.vue'
  import star from 'base/star/star.vue'
  import {getMovieReview} from 'api/moviedetail.js'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        reviewdetail: {},
        fullScreen: true
      }
    },
    created() {
      this._getMovieReview(this.reviewId)
    },
    computed: {
      ...mapGetters(['reviewId'])            // 获取到提交到vuex中电影影评的列表ID
    },
    methods: {
      back() {                       // 点击返回上一层
        this.$router.back()
      },
      _getMovieReview(id) {
        if (!this.reviewId) {                 // 如果当前页面浏览器刷新是就跳转到首页
          this.$router.push('/moiveshow')
          return
        }
        getMovieReview(id).then((res) => {
          this.reviewdetail = res
          // console.log(res)
        })
      }
    },
    components: {
      loading,
      scroll,
      star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "~@/common/stylus/mixin.styl"

  .reviewdetail .fixed-title {
    border-bottom-1px(#ccc)
    position: fixed
    top: 0
    width: 100%
    height: 50px
    z-index: 500
    background-color: #fff;
    line-height: 50px
  }

  .fixed-title .back {
    position: absolute
    top: 0
    left: 6px
    z-index 500
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
  }

  .review-detail {
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 260
    overflow: hidden
    background-color: #fff
  }

  .review-detail .review-content {
    padding 70px 20px 90px 20px
  }

  .review-content .title {
    font-size 22px
    color #333
    line-height: 30px
  }

  .review-content .author {
    margin-top 20px
    display flex
    align-items top
  }

  .author .avatar {
    flex 36px 0 0
    width: 36px
  }

  .avatar img {
    border-radius 50%
  }

  .author .info {
    flex 1
    padding-left 10px
    font-size 12px
  }

  .info .star {
    display inline-block
  }

  .info h2 {
    padding-bottom 5px
  }

  .info .name {
    color #333
    padding-left 5px
  }

  .desc {
    margin-top 30px
    color #333
    line-height: 25px
    white-space pre-wrap
    font-size 16px
    text-indent 2em
  }

  .copyright {
    margin-top 40px
    font-size 12px
    text-align center
  }

  .end {
    position: relative
    margin 30px auto
    text-align: center
    height: 10px
    width: 60%
  }

  .end .line {
    border-bottom-1px(#ccc)
  }

  .end .text {
    padding 0 10px
    display inline-block
    background-color: #fff;
    position absolute
    left: 50%
    top: -8px
    transform translateX(-50%)
    font-size 14px
  }

  .useful {
    text-align center
  }

  .useful div {
    display inline-block
    padding 10px 15px
    margin-right 10px
    color #333
    font-size 14px
    border 1px solid #ccc
    border-radius 5px
  }
</style>
