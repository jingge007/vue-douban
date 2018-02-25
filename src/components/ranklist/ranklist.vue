<!--电影排行列表组件-->
<template>
  <div class="ranklist">
    <ul :class="{'bottom':bottom}">
      <li class="rank-item" v-for="(item,index) in rankItems"
          :class="{'compact':!needRank}"
          @click.stop="selectItem(item,$event)"
      >
        <div class="rank-rating" v-show="needRank">
          <div class="line"></div>
          <span class="text">{{page*50 +(index+1)}}</span>
        </div>
        <div class="rank-info" :class="{'compact':!needRank}">
          <div class="info-img">
            <img v-lazy="replaceUrl(item.image)" alt="" height="100" width="70">
          </div>
          <div class="info-desc">
            <p class="title">{{item.title}}</p>
            <star :size="24" :score="item.rating" :showScore="showScore"></star>
            <div class="director">导演：{{item.director}}</div>
            <div class="casts">主演：{{item.casts}}</div>
          </div>
        </div>
      </li>
    </ul>
    <loading :hasMore="hasMore" v-show="rankItems.length && needLoading"></loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import loading from 'base/loading/loading.vue'
  import star from 'base/star/star.vue'

  export default {
    data() {
      return {
        showScore: true
      }
    },
    props: {
      bottom: {
        type: Boolean,
        default: false
      },
      rankItems: {
        type: Array,
        default: []
      },
      page: {
        type: Number,
        default: 0
      },
      hasMore: {
        type: Boolean,
        default: false
      },
      needRank: {
        type: Boolean,
        default: true
      },
      needLoading: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      selectItem(movie) {
        if (!event._constructed) {               // 忽略浏览器派发的点击事件，只留下scroll组件派发的
          return
        }
        this.$emit('select', movie)
      },
      replaceUrl(url) {            // 图片防盗链处理,把现在的图片连接传进来，返回一个不受限制的路径
        return ('https://images.weserv.nl/?url=' + url.replace(/http\w{0,1}:\/\//, ''))
      }
    },
    components: {
      loading,
      star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "~@/common/stylus/mixin.styl"

  .rank-item {
    padding-top 30px
    background-color: #fff;
  }

  .ranklist .bottom {
    margin-bottom 30px
  }

  .rank-item.compact {
    padding-top: 0
  }

  .rank-item .rank-rating {
    position relative
    margin: 30px auto
    text-align center
    height: 10px
    width: 50%
  }

  .rank-rating .line {
    border-bottom-1px(#ccc)
  }

  .rank-rating .text {
    padding 0 10px
    display inline-block
    background-color: #fff;
    position absolute
    left: 50%
    top: -12px
    transform translateX(-50%)
    font-size 18px
    color #42bd56
  }

  .rank-info {
    display flex
    align-items top
    box-sizing border-box
    height: 130px
    padding 15px
    border: 1px solid #ccc
  }

  .rank-item .rank-info.compact {
    border: 0
    border-bottom-1px(#ccc)
    margin-bottom 0px
  }

  .rank-info .info-img {
    flex 70px 0 0
    margin-right 10px
  }

  .rank-info .info-desc {
    flex 1
    box-sizing border-box
    height: 100px
    padding-bottom 20px
    display flex
    flex-direction column
    justify-content space-around
    overflow: hidden
  }

  .info-desc .title {
    font-size 16px
    color #333
  }

  .info-desc .director {
    font-size 12px
  }

  .info-desc .casts {
    font-size 12px
    no-wrap()
  }

  .rank-info:last-child {
    margin-bottom 30px
  }
</style>
