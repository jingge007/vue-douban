<!--排行组件-->
<template>
  <div class="rank">
    <search @search="goSearch"></search>
    <scroll class="rank-list" ref="scroll" :data="urlList">
      <div class="scroll-wrapper">
        <div class="scroll-content" v-if="hasLoad">
          <h1 class="title">精选榜单</h1>
          <!--top250-->
          <router-link tag="div" to="/rank/top250" class="top250 rank-item">
            <div class="desc">
              <h2 class="name">豆瓣 Top250</h2>
              <span class="brief">8分以上好电影</span>
            </div>
            <div class="rank-img">
              <img :src="replaceUrl(item)" alt="" v-for="(item,index) in urlList[0]" :class="{'top':index === 1}">
            </div>
          </router-link>
          <!--口碑榜-->
          <router-link tag="div" to='/rank/weekly' class="weekly rank-item">
            <div class="desc">
              <h2 class="name">本周口碑榜</h2>
              <span class="brief">{{weekDate}}</span>
            </div>
            <div class="rank-img">
              <img :src="replaceUrl(item)" alt="" v-for="(item,index) in urlList[1]" :class="{'top':index === 1}">
            </div>
          </router-link>
          <!--新片榜-->
          <router-link tag="div" to='/rank/newmovie' class="new-movie rank-item">
            <div class="desc">
              <h2 class="name">新片榜</h2>
              <span class="brief">{{weekDate}}</span>
            </div>
            <div class="rank-img">
              <img :src="replaceUrl(item)" alt="" v-for="(item,index) in urlList[2]" :class="{'top':index === 1}">
            </div>
          </router-link>
          <!--北美票房榜-->
          <router-link tag="div" to='/rank/usbox' class="us-box rank-item">
            <div class="desc">
              <h2 class="name">北美票房榜</h2>
              <span class="brief">票房最高排名</span>
            </div>
            <div class="rank-img">
              <img :src="replaceUrl(item)" alt="" v-for="(item,index) in urlList[3]" :class="{'top':index === 1}">
            </div>
          </router-link>
        </div>
      </div>
    </scroll>
    <loading :fullScreen="fullScreen" v-if="!hasLoad"></loading>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import search from 'base/search/search.vue'
  import scroll from 'base/scroll/scroll.vue'
  import loading from 'base/loading/loading.vue'
  import WeekDate from 'common/js/date.js'
  import {top250Rank, weeklyRank, usBoxRank, newMoviesRank} from 'api/movierank'

  export default {
    data() {
      return {
        fullScreen: true,            // 没有数据的时，开启全屏加载动画
        weekDate: '',                // 口碑榜的日期参数
        hasLoad: false,             // 标志位
        rankImgUrl: [],            // 排行存放图片的数组
        urlList: []
      }
    },
    created() {
      this._getBriefRank()
      this._getWeekDate()
    },
    activated() {                     // keep-alive组件激活
      this.$refs.scroll.refresh()
    },
    methods: {
      goSearch() {            // 点击电影列表搜索框进入搜索页面
        this.$router.push({
          path: `/search`
        })
      },
      getUrlList(url) {                  // 获取处理的图片数据，各个排行榜数据结构不一致需要做处理
        let list = []
        url.forEach((item, index) => {
          let subject = item.subjects.slice(0, 3)           // 只获取返回数据的前三条数据
          list[index] = []
          subject.forEach((item) => {
            list[index].push(item.subject ? item.subject.images.medium : item.images.medium)
          })
        })
        // console.log(list)
        list.forEach((item) => {            // 将第二名排到第一位
          let url = item[0]
          item[0] = item[1]
          item[1] = url
        })
        this.urlList = list
      },
      _getBriefRank() {
        Promise.all([top250Rank(0, 3), weeklyRank(), usBoxRank(), newMoviesRank()]).then((res) => {
          // console.log(res)
          this.$emit('hasLoad')
          this.hasLoad = true
          this.getUrlList(res)
        })
      },
      _getWeekDate() {              // 获取排行榜当前周次起始日期
        let date = new WeekDate()
        this.weekDate = date.getWeekStartDate() + '-' + date.getWeekEndDate()
      },
      replaceUrl(url) {            // 图片防盗链处理,把现在的图片连接传进来，返回一个不受限制的路径
        return ('https://images.weserv.nl/?url=' + url.replace(/http\w{0,1}:\/\//, ''))
      }
    },
    components: {
      search,
      scroll,
      loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .rank-list {
    position fixed
    top: 50px
    left: 0px
    right: 0
    bottom 62px
    padding 0 15px
    overflow hidden
  }

  .rank-list .title {
    color #333
  }

  .rank-list .scroll-content {
    padding: 20px 0
  }

  .rank-list .rank-item {
    margin-top 15px
    height: 130px
    border-radius 10px
    color #fff
  }

  .rank-item .desc {
    vertical-align top
    display inline-block
    box-sizing border-box
    padding-top 50px
    width: 40%
    height: 100%
    text-align: center
  }

  .desc .name {
    font-size 18px
  }

  .desc .brief {
    font-size 12px
  }

  .rank-item .rank-img {
    vertical-align: top
    display: inline-block
    width: 55%
    height: 100%
    text-align center
  }

  .rank-item .rank-img img {
    display inline-block
    vertical-align text-top
    position relative
    top: 50%
    transform translateY(-50%)
    width: 30%
  }

  .rank-item .rank-img img.top {
    width: 35%
  }

  .top250 {
    background: linear-gradient(#E1A708, #EFD491)
  }

  .weekly {
    background: linear-gradient(#32C05E, #A1E5BE)
  }

  .new-movie {
    background: linear-gradient(#A361C3, #D9B9E8)
  }

  .us-box {
    background: linear-gradient(#DD7286, #F3B9C5)
  }

</style>
