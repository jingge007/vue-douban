<!--电影详情页影评的组件-->
<template>
  <div class="moviereview">
    <div class="type-title" v-if="needTitle">影评{{reviewsNum}}条</div>
    <ul>
      <li class="review-item" v-for="item in reviews" @click="selectReview(item.id)">
        <div class="content">
          <h1 class="title">{{item.title}}</h1>
          <div class="user-info">
            <div class="avatar">
              <img v-lazy="item.author.avatar" alt="" width="25" height="25">
            </div>
            <span class="name">{{item.author.name}}</span>
            <star :size="24" :score="item.rating.value*2"></star>
          </div>
          <p class="desc">{{item.summary}}</p>
        </div>
      </li>
    </ul>
    <div class="allReview" v-if="!needTitle" @click="needAllReviews">
      <span>全部影评{{reviewsNum}}个</span>
    </div>
    <loading :hasMore="hasMore" v-show="reviews.length" v-if="needTitle"></loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from 'base/star/star.vue'
  import loading from 'base/loading/loading.vue'

  export default {
    props: {
      reviews: {
        type: Array,
        default: []
      },
      reviewsNum: {
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
    methods: {
      needAllReviews() {                   // 点击全部影评时，将点击事件派发到父组件中
        this.$emit('needAllReviews')
      },
      selectReview(id) {                   // 当进入电影影评列表时，点击列表将此列表的ID传到父组件
        this.$emit('selectReview', id)
      }
    },
    components: {
      star,
      loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .moviereview {
    padding 20px 20px 60px 20px
    background-color: #fff
  }

  .moviereview .type-title {
    font-size 14px
    margin-bottom: 15px
  }

  .moviereview .review-item {
    margin-bottom 20px
  }

  .review-item .content {
    font-size 12px
  }

  .content .title {
    font-size 16px
    color #333
    padding 5px 0
  }

  .content .user-info {
    padding 5px 0
  }

  .user-info .avatar {
    display inline-block
    vertical-align middle
    margin-right 6px
  }

  .avatar img {
    border-radius 50%
  }

  .user-info .name {
    display inline-block
    vertical-align middle
  }

  .user-info .star {
    display inline-block
    vertical-align middle
  }

  .content .desc {
    line-height: 20px
  }

  .allReview {
    font-size 14px
    color #42bd56
    text-align: center
    padding-bottom 10px
  }
</style>
