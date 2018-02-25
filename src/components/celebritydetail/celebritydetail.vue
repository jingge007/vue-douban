<!--影人介绍的详情组件-->
<template>
  <div class="celebritydetail">
    <div class="fixed-title">
      影人信息
      <span class="back" @click="back">
        <i class="icon-back"></i>
      </span>
     <!-- <span class="type" ref="fixed">影人信息</span>-->
    </div>
    <scroll class="celebrity-detail" v-if="celebrityDetail.avatars" :data="celebrityDetail">
      <div class="scroll-wrapper">
        <div class="bg-image" ref="image">
          <img v-lazy="replaceUrl(celebrityDetail.avatars.large)" alt="">
        </div>
        <div class="celebrity-info">
          <div class="main">
            <h1 class="name-cn">{{celebrityDetail.name}}</h1>
            <span class="name-en">{{celebrityDetail.name_en}}</span>
            <div class="collect" @click="saveCollect" :class="{'has-collected':isCollected}">
              <i class="icon" :class="collect"></i>
              <span class="text">{{collectText}}</span>
            </div>
          </div>
          <div class="brief">
            <div class="title">个人简介</div>
            <p class="text" @click="showInfo">
              {{celebrityDetail.summary}}
              <span class="more">
                <i class="icon-keyboard_arrow_right"></i>
              </span>
            </p>
          </div>
          <scroll class="works" ref="scroll" :scrollX="this.scrollX" :eventPassthrough="this.eventPassthrough" :click="this.click" v-if="works.length">
            <div class="works-content" ref="content">
              <h2 class="title">代表作品</h2>
              <div class="work-item" v-for="item in works" @click="selectWork(item,$event)">
                <img v-lazy="replaceUrl(item.image)" alt="" width="90" height="120">
                <h3 class="item-title">{{item.title}}</h3>
                <star :showScore="showScore" :score="item.rating"></star>
              </div>
            </div>
          </scroll>
          <div class="allWorks" @click="getAllWorks">查看全部作品
            <i class="icon-keyboard_arrow_right"></i>
          </div>
        </div>
      </div>
    </scroll>
    <loading :fullScreen="fullScreen" v-if="!celebrityDetail.avatars"></loading>
    <celebrityinfo ref="info" :infoLists="celebrityDetail"></celebrityinfo>
    <router-view></router-view>
  </div>
</template>

<script>
  import scroll from 'base/scroll/scroll.vue'
  import star from 'base/star/star.vue'
  import loading from 'base/loading/loading.vue'
  import {createMovieList} from 'common/js/movielist'
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import {getCelebrity} from 'api/celebrity'
  import Celebrity from 'common/js/celebrity.js'
  import celebrityinfo from 'components/celebrityinfo/celebrityinfo.vue'

  export default {
    data() {
      return {
        celebrityDetail: {},
        click: false,                     // 让滚动组件不支持点击事件，使用原生的点击事件
        eventPassthrough: 'vertical',      // 设置滚动方向为横向滚动
        works: [],
        scrollX: true,            // 支持横向滚动
        fullScreen: true,        // 支持全屏加载动画
        showScore: true,
        collectText: '收藏',
        isCollected: false            // 收藏影人的标志位
      }
    },
    computed: {
      ...mapGetters([
        'currentCelebrityId',
        'collected'
      ]),
      collect() {
        return this.isCollected === false ? 'icon-collect' : 'icon-checkmark'
      }
    },
    created() {
      this._getCelebrity()
    },
    methods: {
      ...mapActions(['markCelebrity']),
      ...mapMutations({setMovie: 'SET_MOVIE'}),
      back() {                // 点击返回上一层路由
        this.$router.back()
      },
      _getCelebrity() {             // 获取影人介绍的数据
        if (!this.currentCelebrityId) {
          this.$router.push('/moiveshow')
          return
        }
        getCelebrity(this.currentCelebrityId).then((res) => {
          console.log(res)
          this.celebrityDetail = res       // 需要把影人作品包装成电影类，否则传递给vuex的类型会出现问题，即使以对象的格式只传入id，如果在跳转后的界面进行收藏操作也会由于数据不全影响收藏列表的展示
          let ret = []
          res.works.forEach((item) => {
            ret.push(item.subject)
          })
          this.works = createMovieList(ret)
          this._checkCollect()
          const mainworks = []           // 把影人包装成影人类，便于收藏和读取收藏
          res.works.forEach((item) => {
            mainworks.push(item.subject.title)
          })
          this.celebrity = new Celebrity({
            id: res.id,
            name: res.name,
            image: res.avatars.large,
            works: mainworks.slice(0, 3).join(' / ')
          })
          this._initPics()
        })
      },
      replaceUrl(url) {            // 图片防盗链处理
        return ('https://images.weserv.nl/?url=' + url.replace(/http\w{0,1}:\/\//, ''))
      },
      _checkCollect() {           // 收藏影人的数据
        const index = this.collected.findIndex((item) => {
          return item.id === this.celebrityDetail.id
        })
        if (index > -1) {
          this.isCollected = true
          this.collectText = '已收藏'
        } else {
          this.isCollected = false
          this.collectText = '收藏'
        }
      },
      saveCollect() {            // 点击收藏的按钮将数据提交到action中
        this.markCelebrity(this.celebrity)
        this.isCollected = !this.isCollected
        if (!this.isCollected) {
          this.collectText = '收藏'
        } else {
          this.collectText = '已收藏'
        }
      },
      showInfo() {          // 点击个人简介进入影人的详情简介介绍
        this.$refs.info.show()
      },
      _initPics() {             // 计算影人代表作品的总宽度
        let picWidth = 130
        let margin = 8
        let width = (picWidth + margin) * this.celebrityDetail.works.length - margin
        this.$nextTick(() => {
          this.$refs.content.style.width = width + 'px'
        })
      },
      selectWork(movie) {         // 点击影人代表作品进入电影介绍的详情页
        if (!event._constructed) {
          return;
        }
        this.setMovie(movie)
        this.$router.push({
          path: `/moiveshow/${movie.id}`
        })
      },
      getAllWorks() {             // 查看全部作品
        this.$router.push({
          path: `/clebrity/${this.currentCelebrityId}/works`
        })
      }
    },
    components: {
      scroll,
      star,
      loading,
      celebrityinfo
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "~@/common/stylus/mixin.styl"

  .celebritydetail {
    position fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    background-color: #555
    z-index: 10
  }

  .fixed-title {
    position fixed
    top: 0
    width: 100%
    height: 40px
    line-height: 40px
    z-index: 100
    background-color: #4EE559
    font-size: 16px
    color #fff
    text-align center
  }

  .fixed-title .back {
    position absolute
    top: 0
    left: 6px
    z-index 50
  }

  .back .icon-back {
    display block
    padding 11px
    font-size 18px
    color: #fff;
  }

  .celebrity-detail {
    position fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    background-color: #555
  }

  .celebrity-detail .bg-image {
    text-align center
    padding: 50px 0 20px 0
    background-color: #555;
  }

  .bg-image img {
    width: 50%
    vertical-align: middle
  }

  .celebrity-info {
    background-color: #fff
    padding 15px 20px 60px 20px
  }

  .celebrity-info .main {
    position relative
  }

  .main .name-cn {
    font-size 16px
    color #333
  }

  .main .name-en {
    display inline-block
    padding-top: 7px
    font-size 14px
  }

  .main .collect {
    position absolute
    top: 0
    right: 0
    height: 30px
    line-height: 30px
    width: 80px
    text-align: center
    fnot-size 14px
    border: 1px solid #42bd56
    border-radius 10px
  }

  .main .collect.has-collected {
    border: 1px solid #FE9800
    color #FE9800
  }

  .main .collect.has-collected .icon {
    color #FE9800
  }

  .main .collect.has-collected .text {
    color #FE9800
  }

  .main .collect .icon {
    display: inline-block
    vertical-align middle
    color: #42bd56
  }

  .main .collect .text {
    font-size: 12px
    display inline-block
    color #42bd56
  }

  .brief {
    position relative
    margin-top: 30px
    font-size 14px
  }

  .brief .text {
    position relative
    padding-right 30px
    display -webkit-box
    -webkit-line-clamp 3
    -webkit-box-orient vertical
    overflow hidden
    margin-top: 20px
    color #333
    line-height: 20px
  }

  .brief .text .more {
    position absolute
    top: 50%
    transform translateY(-50%)
    right: -10px
    font-size 40px
    color #42bd56
  }

  .works {
    margin-top 30px
    padding-bottom 20px
    font-size 14px
    white-space nowrap
    overflow hidden
    font-size 0
    border-bottom-1px(#ccc)
  }

  .works-content .title {
    font-size 14px
    padding-bottom 20px
  }

  .works-content .work-item {
    width: 130px
    vertical-align top
    display inline-block
    margin-right 8px
    font-size 14px
    text-align center
  }

  .work-item img {
    height: 200px
    width: 130px
  }

  .work-item .item-title {
    color #333
    padding 8px 0 5px 0
    no-wrap()
  }

  .allWorks {
    padding 20px 0
    font-size 14px
  }

  .allWorks i {
    display inline-block
    vertical-align middle
    font-size 22px
  }
</style>
