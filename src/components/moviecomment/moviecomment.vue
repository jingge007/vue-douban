<!--电影详情页短评的组件-->
<template>
  <div class="moviecomment">
    <div class="type-title" v-if="needTitle">短评{{commentNum}}条</div>
    <ul>
      <li class="comment-item" v-for="(item,index) in comments">
        <div class="avatar">
          <img v-lazy="item.author.avatar" alt="" width="36" height="36">
        </div>
        <div class="content">
          <h1 class="name">{{item.author.name}}</h1>
          <star :size="24" :score="item.rating.value*2"></star>
          <p class="text">{{item.content}}</p>
          <span class="date">{{item.created_at}}</span>
          <div class="useful-count" @click="markItem(item.id,index)" :class="{'like':isLike(item.id)}">
            <i class="icon-thumb_up"></i>
            {{item.useful_count}}
          </div>
        </div>
      </li>
    </ul>
    <div class="allComment" v-if="!needTitle" @click="needAllComments">
      <span>全部短评{{commentNum}}个</span>
    </div>
    <loading v-show="comments.length" v-if="needTitle" :hasMore="hasMore"></loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from 'base/star/star.vue'
  import loading from 'base/loading/loading.vue'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    props: {
      comments: {
        type: Array,
        default: []
      },
      commentNum: {
        type: Number,
        default: 0
      },
      needTitle: {
        type: Boolean,
        default: false
      },
      hasMore: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      ...mapGetters(['favoriteComments'])
    },
    methods: {
      ...mapActions(['markComment']),
      needAllComments() {                  // 点击全部短评派发事件到父组件
        this.$emit('needAllComments')
      },
      markItem(id, index) {               // 点击电影短评的点赞时，将ID和index的数据提交到action中
        this.markComment(id)
        const commentIndex = this.favoriteComments.findIndex((item) => {
          return item === id
        })
        if (commentIndex > -1) {
          this.comments[index].useful_count++
        } else {
          this.comments[index].useful_count--
        }
      },
      isLike(id) {              // 电影短评点赞时变色
        const index = this.favoriteComments.findIndex((item) => {
          return item === id
        })
        if (index > -1) {
          return true
        }
        return false
      }
    },
    components: {
      star,
      loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .moviecomment {
    padding 20px 20px 60px 20px
    background-color: #fff
  }

  .moviecomment .type-title {
    font-size 14px
    margin-bottom: 15px
  }

  .moviecomment .comment-item {
    display flex
    margin-bottom 20px
  }

  .comment-item .avatar {
    flex 0 0 36px
    width: 36px
    margin-right: 12px
  }

  .comment-item .avatar img {
    border-radius 50%
  }

  .comment-item .content {
    flex 1
    position relative
    font-size 14px
    color #333
  }

  .content .name {
    display inline-block
    line-height 25px
    margin-right 5px
  }

  .content .star {
    display inline-block
  }

  .content .text {
    line-height: 20px
    text-indent: 2em;
  }

  .content .date {
    font-size 12px
    color #777
    line-height: 25px
  }

  .content .useful-count {
    position: absolute
    color #777
    top: 5px
    right: 5px
  }

  .useful-count.like {
    color #42bd56
  }

  .allComment {
    font-size 14px
    color #42bd56
    text-align center
    padding-bottom 10px
  }
</style>
