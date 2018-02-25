<template>
  <div class="historylist">
    <ul>
      <li :key="item" class="history-item" v-for="item in searches" @click="selectItem(item)">
        <div class="text">{{item}}</div>
        <div class="icon" @click.stop="deleteOne(item)">
          <i class="icon-close"></i>
        </div>
      </li>
    </ul>
    <div class="no-history" v-show="!searches.length">还没有搜索历史...</div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      deleteOne(item) {
        this.$emit('delete', item)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "~@/common/stylus/mixin.styl"

  .historylist .history-item {
    display flex
    justify-content center
    height: 40px
    line-height: 40px
    overflow: hidden
    padding 0 20px
  }

  .history-item .text {
    flex 1
    font-size 14px
    color #777
  }

  .history-item .icon {
    extend-click()
  }

  .icon .icon-close {
    font-size 12px
    color #333
  }

  .no-history {
    height: 40px
    line-height: 40px
    text-align: center
    font-size 14px
  }

</style>
