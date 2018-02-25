<!--搜索电影页组件-->
<template>
  <transition name="search-move">
    <div class="search">
      <!--搜索框组件-->
      <searchBox @query="onQueryChange"
                 :tagSearch="tagSearch"
                 v-show="!tagSearch"
                 ref="searchBox"
                 @focusInput="focusInputs"
                 @blurInput="blurInputs"
      ></searchBox>
      <div class="fixed-title" v-show="tagSearch">
        <span class="back" @click="back">
          <i class="icon-back"></i>
        </span>
        <span class="type">
          <span>关于{{query}}的电影</span>
        </span>
      </div>
      <div class="shortcut-wrapper" v-show="!query">
        <div class="tag-list">
          <h2 class="search-title">搜索关键词</h2>
          <div class="douban-tag">
            <span class="tag-item" v-for="item in doubanTag" @click="tagQuery(item)">{{item}}</span>
          </div>
        </div>
        <!--搜索历史-->
        <div class="search-history">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
                <i class="icon-bin"></i>
              </span>
          </h1>
          <scroll class="shortcut" ref="shortcut" :beforeScroll="beforeScroll" @beforeScroll="listenScroll">
            <div>
              <historylist :searches="searchHistory" @select="addQuery" @delete="deleteOne"></historylist>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-if="query" ref="searchResult" :class="{'tag-search':tagSearch}">
        <suggest ref="suggest"
                 :tagSearch="tagSearch"
                 :query="query"
                 @listScroll="blurInput"
                 @select="saveSearch"
        ></suggest>
      </div>
      <confirm ref="confirm" text="是否清空所有搜索历史" confirmbtnText="清空" @confirm="clearSearchHistory"></confirm>
      <tab :tabFlag="tabFlag"></tab>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import searchBox from 'base/searchBox/searchBox.vue'
  import scroll from 'base/scroll/scroll.vue'
  import confirm from 'base/confirm/confirm.vue'
  import suggest from 'components/suggest/suggest.vue'
  import historylist from 'base/historylist/historylist.vue'
  import {mapGetters, mapActions} from 'vuex'
  import tab from 'components/tab/tab.vue'

  export default {
    name: 'search',
    data() {
      return {
        query: '',
        tagSearch: false,
        doubanTag: ['剧情', '爱情', '喜剧', '科幻', '动作', '悬疑', '治愈', '青春', '文艺', '经典', '豆瓣高分'],
        beforeScroll: true,
        tabFlag: true
      }
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    computed: {
      ...mapGetters(['searchHistory'])
    },
    mounted() {
      this.$nextTick(() => {
        this.focusInput()
      })
    },
    methods: {
      ...mapActions(['saveSearchHistory', 'deleteSearchHistory', 'clearSearchHistory']),
      onQueryChange(query) {           // 获取到从子组件中传过来的query
        this.query = query
      },
      back() {                 // 清空搜索项
        this.tagSearch = false
        this.query = ''
      },
      tagQuery(query) {          // 点击搜索关键词隐藏搜索框
        this.tagSearch = true
        this.query = query
      },
      listenScroll() {          // 在滚动之前让输入框失去焦点隐藏键盘
        this.blurInput()
      },
      blurInput() {           // 让子组件的输入框失去焦点
        this.$refs.searchBox.blur()
      },
      focusInput() {         // 让子组件的输入框获得焦点
        this.$refs.searchBox.focus()
      },
      showConfirm() {        // 点击垃圾桶显示删除提示框
        this.$refs.confirm.show()
      },
      saveSearch() {     // 点击搜索结果列表时，将搜索词缓存到本地
        if (!this.tagSearch) {
          this.saveSearchHistory(this.query)
        }
      },
      addQuery(query) {              // 将搜索历史搜索框并搜索
        this.$refs.searchBox.setQuery(query)
      },
      deleteOne(item) {
        this.deleteSearchHistory(item)
      },
      focusInputs() {
        this.tabFlag = false
      },
      blurInputs() {
        this.tabFlag = true
      }
    },
    components: {
      searchBox,
      scroll,
      confirm,
      suggest,
      historylist,
      tab
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "~@/common/stylus/mixin.styl"

  .search {
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    background-color: #fff
    z-index 9995
  }

  .search-move-enter-active, .search-move-leave-active {
    transition all 0.3s
  }

  .search-move-enter, .search-move-leave-to {
    transform translate3d(-100%, 0, 0)
  }

  .fixed-title {
    border-bottom-1px(#ccc)
    position: fixed
    top: 0
    width: 100%
    height: 50px
    /*z-index: 300*/
    /*background-color: #fff*/
  }

  .fixed-title .back {
    position: absolute
    top: 0px
    left: 6px
    z-index: 100
  }

  .back .icon-back {
    display: block
    padding: 15px
    font-size 18px
    color #42bd56
  }

  .fixed-title .type {
    line-height: 50px
    font-size 16px
    padding-left 60px
    color #333
  }

  .shortcut-wrapper {
    position: fixed
    top: 50px
    bottom: 0
    width: 100%
  }

  .shortcut-wrapper .shortcut {
    position: absolute;
    top: 230px;
    bottom: 75px
    overflow: hidden;
    box-sizing: border-box;
    width: 100%
  }

  .tag-list {
    padding 15px 15px 0 15px
  }

  .tag-list .search-title {
    color #98989A
    font-size 16px
    padding-bottom 15px
  }

  .douban-tag .tag-item {
    display: inline-block;
    padding: 5px 10px;
    margin: 0 20px 10px 0;
    border-radius: 6px;
    font-size 14px
    color #42bd56
    border 1px solid #42bd56
  }

  .search-history .title {
    display flex
    align-items top
    height: 40px
    font-size 18px
    color #42bd56
    padding 20px 20px 0 20px
  }

  .title .text {
    flex 1
  }

  .title .clear {
    extend-click()
  }

  .clear .icon-bin {
    font-size 18px
    color #42bd56
  }

  .search-result {
    position fixed
    width: 100%
    top: 50px
    bottom: 0
    background-color: #fff;
  }
</style>
