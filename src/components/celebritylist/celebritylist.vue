<!--收藏影人列表的组件-->
<template>
  <div class="celebritylist">
    <ul>
      <li class="celebrity-item" @click="selectItem(item.id,$event)" v-for="item in celebrities">
        <div class="image">
          <img v-lazy="replaceUrl(item.image)" alt="" height="120" width="80">
        </div>
        <div class="desc">
          <p class="title">{{item.name}}</p>
          <div class="works">代表作：{{item.works}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      celebrities: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(id) {
        this.$emit('select', id)
      },
      replaceUrl(url) {            // 图片防盗链处理,把现在的图片连接传进来，返回一个不受限制的路径
        return ('https://images.weserv.nl/?url=' + url.replace(/http\w{0,1}:\/\//, ''))
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import '~@/common/stylus/mixin.styl'

  .celebrity-item {
    display: flex
    align-items top
    box-sizing border-box
    height: 130px
    padding 15px
    border-bottom-1px(#ccc)
    background-color: #fff;
  }

  .celebrity-item .image {
    flex 80px 0 0
    margin-right 10px
  }

  .desc {
    flex 1
    box-sizing border-box
  }

  .desc .title {
    font-size 16px
    color #333
  }

  .desc .works {
    margin-top 10px
    font-size 14px
    line-height: 20px
  }
</style>
