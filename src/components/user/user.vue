<!--我的组件-->
<template>
  <div class="user-cetner">
    <div class="user">
      <div class="login">登录</div>
      <div class="register">注册</div>
      <div class="avatar">
        <img src="./avatar.jpg" alt="" width="70" height="70">
      </div>
      <div class="name">这里是用户名</div>
    </div>
    <switches :switches="switches" :currentIndex="currentIndex" @switch="switchTab"></switches>
    <scroll class="switch-item" ref="scroll" :data="itemLists">
      <div class="user-item" v-for="(item,index) in switches" v-if="index===currentIndex">
        <div class="movie-num" v-show="index===0">总共有：{{itemLength}}部电影想看</div>
        <div class="movie-num" v-show="index===1">总共看过：{{itemLength}}部电影</div>
        <div class="movie-num" v-show="index===2">总共收藏：{{itemLength}}个影人</div>
        <ranklist :rankItems="itemLists"
                  :needLoading="needLoading"
                  v-if="index !==2"
                  @select="selectMovie"
                  :needRank="needRank"></ranklist>
        <celebritylist v-else :celebrities="itemLists" @select="selectCelebrity"></celebritylist>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import switches from 'base/switches/switches.vue'
  import scroll from 'base/scroll/scroll.vue'
  import ranklist from 'components/ranklist/ranklist.vue'
  import {mapGetters, mapMutations} from 'vuex'
  import celebritylist from 'components/celebritylist/celebritylist.vue'

  export default {
    data() {
      return {
        currentIndex: 0,
        needLoading: false,
        needRank: false,
        switches: [
          {name: '想看的电影'},
          {name: '看过的电影'},
          {name: '收藏的影人'}
        ],
        itemLists: [],
        itemLength: 0
      }
    },
    watch: {
      wantedMovies(lists) {
        if (this.currentIndex === 0) {
          this.itemLists = lists
          this.itemLength = lists.length
        }
      },
      watchedMovies(lists) {
        if (this.currentIndex === 1) {
          this.itemLists = lists
          this.itemLength = lists.length
        }
      },
      collected(lists) {
        if (this.currentIndex === 2) {
          this.itemLists = lists
          this.itemLength = lists.length
        }
      }
    },
    created() {
      this.itemLists = this.wantedMovies
      this.itemLength = this.wantedMovies.length
      this.$emit('hasLoad')
    },
    computed: {
      ...mapGetters([
        'wantedMovies',
        'watchedMovies',
        'collected'
      ])
    },
    activated() {         // 当keep-alive组件激活时
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    },
    methods: {
      ...mapMutations({
        setMovie: 'SET_MOVIE',
        setCelebrity: 'SET_CELEBRITY_ID'
      }),
      switchTab(index) {              // 点击切换tab栏
        this.currentIndex = index
        switch (index) {
          case 0:
            this.itemLists = this.wantedMovies
            break
          case 1:
            this.itemLists = this.watchedMovies
            break
          case 2:
            this.itemLists = this.collected
            break
        }
        this.itemLength = this.itemLists.length
        this.$nextTick(() => {
          this.$refs.scroll.scrollTo(0, 0)
          this.$refs.scroll.refresh()
        })
      },
      selectMovie(movie) {          // 点击列表的电影进入电影详情页
        this.setMovie(movie)
        this.$router.push({
          path: `/movieshow/${movie.id}`
        })
      },
      selectCelebrity(id) {           // 点击影人列表进入影人详情页
        this.setCelebrity(id)
        this.$router.push({
          path: `/clebrity/${id}`
        })
      }
    },
    components: {
      switches,
      scroll,
      ranklist,
      celebritylist
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .user-cetner {
    position: fixed
    top: 0
    bottom: 61px
    left: 0
    right: 0
    background-color: #f8f8f8
    overflow: hidden
  }

  .user-cetner .user {
    box-sizing border-box
    width: 100%
    height: 150px
    background linear-gradient(#42bd56, #9AD57F)
    padding 35px 50px 35px 20px
    display flex
    align-items center
    position relative
  }

  .user .avatar {
    flex 80px 0 0
    width: 80px
  }

  .user .avatar img {
    border-radius 50%
  }

  .user .name {
    flex 1
    color #fff
    font-size 18px
  }

  .switch-item {
    position absolute
    top: 197px
    width: 100%
    bottom: 0
    overflow: hidden
  }

  .switch-item .user-item .movie-num {
    height: 40px
    line-height: 40px
    padding 0 20px
    font-size 14px
  }

  .switch-item .user-item .rank-list {
    background-color: #fff;
  }

  .switch-item .user-item .develop {
    text-align center
    color #42bd56
  }

  .user .login, .user .register {
    padding: 12px
    line-height: 30px
    text-align center
    font-size 14px
    color #fff
  }

  .user .login {
    position: absolute
    top: 10px
    right 70px
  }

  .user .register {
    position: absolute
    top: 10px
    right 10px
  }
</style>
