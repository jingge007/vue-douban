<!--头部搜索框组件-->
<template>
  <div class="go-search" @click="goSearch">
    <div class="logo">
      <img src="./douban-logo.png" alt="" class="src" width="35" height="35">
    </div>
    <div class="search-content">
      <span class="icon-search"></span>
      <span>电影/影人/标签</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    methods: {
      goSearch() {
        this.$emit('search')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>

  .go-search {
    height: 50px
    box-sizing border-box
    padding 10px 10px 5px 60px
    text-align: center
  }

  .go-search .logo {
    position: absolute
    left: 10px
  }

  .go-search .search-content {
    background-color: #EEEEEE
    font-size 16px
    line-height: 35px
    border-radius 8px
  }

  .search-content span {
    display: inline-block
    vertical-align middle
  }
</style>
