<!--电影展示列表组件-->
<template>
  <div class="movielist">
    <ul>
      <li ref="group" v-for="(item,index) in moviehot" @click="selectItem(item)">
        <div class="date" v-if="timeData && !dateEqual(index)">{{item.date}}</div>
        <div class="item">
          <div class="info-img">
            <img v-lazy="replaceUrl(item.image)" alt="" height="120" width="80">
          </div>
          <div class="info-desc">
            <p class="title">{{item.title}}</p>
            <star :showScore="showScore" :size="24" :score="item.rating" class="stars"></star>
            <div class="director">导演：{{item.director}}</div>
            <div class="casts">主演：{{item.casts}}</div>
            <div class="hasWatched">{{item.collectCount}} 人看过</div>
          </div>
        </div>
      </li>
    </ul>
    <loading :hasMore="hasMore" v-if="moviehot.length"></loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import loading from 'base/loading/loading.vue'
  import star from 'base/star/star.vue'

  export default {
    data() {
      return {
        showScore: true,
        casts: []
      }
    },
    props: {
      moviehot: {
        type: Array,
        default: []
      },
      hasMore: {
        type: Boolean,
        default: true
      },
      timeData: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.listHeight = []
      this.indexMap = {}
    },
    watch: {
      moviehot() {
        if (this.timeData) {
          setTimeout(() => {           // 需要延迟来保证dom更新
            this.getMap()
            this._recalculateHeight()
          }, 20)
        }
      }
    },
    methods: {
      selectItem(item) {               // 点击电影列表时，将电影列表的数据传到电影详情页
        this.$emit('select', item)
      },
      dateEqual(index) {          // 确定相邻两部电影日期是否一样，划分日期分组
        if (index === 0) {
          return false
        }
        return this.moviehot[index].date === this.moviehot[index - 1].date
      },
      recalculate() {                  // 重新计算各个区域高度，防止用户在发起新数据请求后切换选项卡无法正确获取高度
        setTimeout(() => {            // 需要延迟来保证dom更新
          this.getMap()
          this._recalculateHeight()
        }, 20)
      },
      getMap() {        // 根据日期创建电影分组
        let movielists = {}
        for (let i = 0; i < this.moviehot.length; i++) {
          if (movielists[this.moviehot[i].date]) {
            movielists[this.moviehot[i].date].push(i)
          } else {
            movielists[this.moviehot[i].date] = [i]
          }
        }
        this.indexMap = movielists
        // console.log(this.indexMap)
      },
      _recalculateHeight() {       // 计算每个区间的高度
        this.listHeight = []
        const list = this.$refs.group
        let height = 0
        let map = Object.values(this.indexMap)
        // console.log(map)
        this.listHeight.push(height)
        map.forEach((item, index) => {
          item.forEach((item) => {
            height += list[item].clientHeight
          })
          this.listHeight.push(height)
        })
        this.$emit('getHeight', this.listHeight)
        this.$emit('getMap', Object.keys(this.indexMap))
        // console.log(Object.keys(this.indexMap))
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
  .movielist ul .date {
    width: 100%
    background-color: #eee
    padding-left 5px
    height: 30px
    line-height: 30px
  }

  .movielist ul .item {
    display: flex
    align-items center
    box-sizing border-box
    padding 15px 0
  }

  .item .info-img {
    flex 80px 0 0
    margin-right 10px
  }

  .item .info-desc {
    height: 120px
    flex 1
    display: flex
    flex-direction column
    justify-content space-around
    overflow: hidden
  }

  .info-desc .title {
    font-size 16px
    color #333
    no-wrap()
  }

  .info-desc .director {
    font-size 12px
  }

  .info-desc .casts {
    font-size 12px
    no-wrap()
  }

  .info-desc .hasWatched {
    color #333
    font-size 12px
  }

  .info-desc .stars {
    display: inline-block
  }
</style>
