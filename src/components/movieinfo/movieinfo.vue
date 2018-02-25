<!--详情页电影信息的组件-->
<template>
  <div class="movieinfo">
    <div class="overall">
      <!--电影详情信息-->
      <div class="desc">
        <h2 class="title">{{moviedetail.title}}</h2>
        <span class="original-title">电影原名：{{moviedetail.original_title}}</span>
        <span class="duration">电影片长：{{durations}}</span>
        <span class="tag">电影类型：{{tag}}</span>
        <span class="pubdate">上映时间：{{pubdate}}</span>
      </div>
      <!--电影的豆瓣评分-->
      <div class="rank">
        <span class="origin">豆瓣评分</span>
        <span class="rating" v-show="rating">{{normalizeScore()}}</span>
        <star :size="24" :score="moviedetail.rating.average" :needNullStar="needNullStar" class="star"></star>
        <span class="num">{{moviedetail.ratings_count}} 人</span>
      </div>
    </div>
    <!--电影的观看按钮-->
    <div class="operate">
      <!--想看的电影-->
      <div class="want-watch"
           v-text="wantedText"
           @click="saveWantedMovie"
           :class="{'wanted':isWanted(moviedetail.id)}"
      ></div>
      <!--看过的电影-->
      <div class="has-watched"
           @click="saveWatchedMovie"
           :class="{'wacthed':isWatched(moviedetail.id)}"
      ><img src="./avatar.jpg" alt="" width="25" height="25" v-show="hasWacthed">
        {{watchedText}}
      </div>
    </div>
    <!--电影剧情简介-->
    <div class="summary">
      <h2 class="title">剧情简介</h2>
      <p class="content">{{moviedetail.summary}}</p>
    </div>
    <h2 class="casts-content-title">影人</h2>
    <scroll class="casts" :scrollX="this.scrollX" :eventPassthrough="this.eventPassthrough" ref="scroll" :click="this.click">
      <div class="casts-content" ref="content">
        <div class="cast-item" v-for="item in allCasts" @click="selectCelebrity(item.id,$event)">
          <img v-lazy="replaceUrl(item.avatars.large)" alt="" width="90" height="120">
          <h3 class="item-title">{{item.name}}</h3>
          <span v-if="item.isDirector">导演</span>
          <span v-else>演员</span>
        </div>
        <div class="no-result" v-if="!allCasts.length">抱歉，暂无影人信息...</div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import scroll from 'base/scroll/scroll.vue'
  import star from 'base/star/star.vue'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    data() {
      return {
        eventPassthrough: 'vertical',           // 忽略better-scroll垂直滚动的方向
        scrollX: true,
        needNullStar: true,          // 星星评分的显示隐藏定义的变量
        wantedText: '想看',
        watchedText: '看过 ☆☆☆☆☆',
        wanted: false,                     // 想看电影的标志位
        hasWacthed: false,                 // 看过电影的标志位
        click: false
      }
    },
    props: {
      moviedetail: {
        type: Object,
        default: {}
      }
    },
    mounted() {
      this.$nextTick(() => {
        this._initPic()
        this.$refs.scroll.refresh()
      })
    },
    computed: {
      ...mapGetters(['movie', 'watchedMovies', 'wantedMovies']),
      tag() {              // 获取电影类型的信息
        let year = this.moviedetail.year
        let tag = this.moviedetail.genres.join(' / ')            // join() 方法用于把数组中的所有元素转换一个字符串。
        return `${year} / ${tag}`
      },
      pubdate() {            // 获取电影上映的数据及判断电影上映的数据
        let pubdate = ''
        let date = this.moviedetail.pubdates
        for (let i = 0; i < date.length; i++) {
          if (date[i].indexOf('电影节') === -1) {          // indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。没有就会返回-1
            pubdate = date[i]           // 没有在中国大陆上映，就取电影节的最后一个信息
          }
          if (date[i].indexOf('中国大陆') > -1) {       // 下中国大陆上映的电影
            pubdate = date[i]
            break           // 跳出本次循环
          }
        }
        if (!pubdate) {          // 没有上映的电影时
          pubdate = '暂无上映信息'
        }
        return pubdate
      },
      durations() {            // 获取电影片长的第一个数据
        return this.moviedetail.durations[0]
      },
      rating() {               // 判断豆瓣电影的评分
        let rating = this.moviedetail.rating.average
        if (rating === 0) {
          return false
        }
        return true
      },
      allCasts() {             // 获取导演和演员的分组数据
        let removeIndex = []
        this.moviedetail.directors.forEach((item, index) => {
          item.isDirector = true
          if (item.avatars === null) {        // 当导演数据不存在照片时
            removeIndex.push(index)
          }
        })
        for (let i = removeIndex.length; i > 0; i--) {
          this.moviedetail.directors.splice(removeIndex[i - 1], 1)
        }
        removeIndex = []       // 重置移除的清单
        this.moviedetail.casts.forEach((item, index) => {
          if (item.avatars === null) {        // 当演员数据不存在照片时
            removeIndex.push(index)
          }
        })
        for (let i = removeIndex.length; i > 0; i--) {
          this.moviedetail.casts.splice(removeIndex[i - 1], 1)
        }
        return this.moviedetail.directors.concat(this.moviedetail.casts)
      }
    },
    methods: {
      ...mapActions(['markWatchedMovie', 'markWantedMovie']),
      normalizeScore() {          // 豆瓣电影评分末尾补零
        let len = this.moviedetail.rating.average.toString().length                    // toString() 方法可把一个逻辑值转换为字符串，并返回结果。
        if (len < 2) {
          return `${this.moviedetail.rating.average}.0`
        }
        return this.moviedetail.rating.average
      },
      saveWantedMovie() {               // 点击想看的电影时，将想看的电影数据提交到actions中
        this.markWantedMovie(this.movie)
        const index = this.wantedMovies.findIndex((item) => {
          return item.id === this.movie.id
        })
        if (index > -1) {         // 当前想看的电影数据存在时
          this.wantedText = '已想看'
        } else {
          this.wantedText = '想看'
        }
      },
      isWanted(id) {                 // 点击想看的电影按钮时变色
        const index = this.wantedMovies.findIndex((item) => {
          return item.id === id
        })
        if (index > -1) {
          return true
        }
        return false
      },
      saveWatchedMovie() {         // 点击看过的电影时，将看过电影数据提交到actions中
        this.markWatchedMovie(this.movie)
        const index = this.watchedMovies.findIndex((item) => {
          return item.id === this.movie.id
        })
        if (index > -1) {            // 当前看过的电影数据存在时
          this.hasWacthed = true
          this.watchedText = '已看过'
        } else {
          this.hasWacthed = false
          this.watchedText = '看过 ☆☆☆☆☆'
        }
      },
      isWatched(id) {                 // 点击看过的电影按钮时变色
        const index = this.watchedMovies.findIndex((item) => {
          return item.id === id
        })
        if (index > -1) {
          this.hasWacthed = true
          return true
        }
        return false
      },
      _initPic() {             // 影人区域的左右滑动
        let picWidth = 90
        let margin = 8
        let width = (picWidth + margin) * this.allCasts.length - margin
        this.$refs.content.style.width = width + 'px'
      },
      selectCelebrity(id) {               // 在电影详情页中点击影人图片时进入影人介绍页
        if (!event._constructed) {
          return;
        }
        this.$emit('selectCelebrity', id)
      },
      replaceUrl(url) {            // 图片防盗链处理,把现在的图片连接传进来，返回一个不受限制的路径
        return ('https://images.weserv.nl/?url=' + url.replace(/http\w{0,1}:\/\//, ''))
      }
    },
    components: {
      scroll,
      star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "~@/common/stylus/mixin.styl"

  .movieinfo {
    background-color: #fff
    padding 0 20px
  }

  .movieinfo .overall {
    display: flex
    height: 140px
    justify-content space-between
  }

  .overall .desc {
    flex 70% 0 0
    overflow: hidden
    display flex
    flex-direction column
    justify-content space-around
  }

  .desc .title {
    font-size 18px
    color #333
    padding 10px 0 5px 0
    no-wrap()
  }

  .desc span {
    font-size 12px
    no-wrap()
  }

  .overall .rank {
    height: 70px
    margin-top: 15px
    padding 10px 8px
    display: flex
    align-items center
    flex-direction column
    justify-content space-between
    box-shadow 0px 0px 5px #ccc
    background-color: #f8f8f8
  }

  .rank .star {
    text-align: center
  }

  .rank span {
    font-size 12px
    color #777
  }

  .rank .rating {
    font-size 18px
    color #333
  }

  .rank .star {
    display: block
  }

  .summary {
    margin-top 20px
    padding-top: 20px
    boeder-top-1px(#ccc)
  }

  .summary .title {
    font-size 14px
    color #000
  }

  .summary .content {
    text-indent 1.5em
    padding-top 10px
    font-size 14px
    color #333
    line-height: 25px
  }

  .operate {
    margin-top: 20px
    line-height: 35px
    height: 35px
    display flex
    text-align center
    font-size 14px
    color #42bd56
  }

  .operate .want-watch {
    flex 1
    border 1px solid #42bd56
    border-radius 5px
    margin-right 20px
  }

  .want-watch.wanted {
    border: 1px solid #FE9800
    color #FE9800
  }

  .operate .has-watched {
    flex 2
    border 1px solid #42bd56
    border-radius 5px
  }

  .has-watched.wacthed {
    border: 1px solid #FE9800
    color #FE9800
  }

  .has-watched img {
    display inline-block
    vertical-align middle
    padding-bottom 2px
    border-radius 50%
  }

  .casts {
    padding 15px 0 30px 0
    width: 100%
    white-space nowrap
    overflow: hidden
    font-size 0
    border-bottom-1px(#ccc)
  }

  .casts-content-title {
    font-size 14px
    padding-top 30px
  }

  .casts-content .cast-item {
    width: 90px
    vertical-align top
    display inline-block
    text-align: center
    margin-right 8px
    font-size 12px
  }

  .cast-item img {
    height: 120px
    width: 90px
  }

  .cast-item .item-title {
    color #333
    padding 8px 0 5px 0
    no-wrap()
  }

  .no-result {
    text-align center
    font-size 12px
    color #42bd56
  }
</style>
