<template>
  <div class="loading" :class="{'full':fullScreen}">
    <div class="hasmore" v-if="hasMore">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="nomore" v-else>没有更多数据了...</div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      hasMore: {
        type: Boolean,
        default: true
      },
      fullScreen: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .loading {
    width: 90%
    height: 15px
    margin 0 auto
    text-align center
    padding-bottom 10px
    display block
  }

  .loading .nomore {
    text-align: center;
    color: #24C524;
    font-size: 16px;
  }

  .loading.full {
    position: absolute
    top: 50%
    width: 100%
    transform translateY(-50%)
  }

  .hasmore {
    height: 100%
  }

  .hasmore span {
    display: inline-block
    width: 15px
    height: 100%
    margin-right 5px
    background-color: #90EE90
    animation load 1.04s ease infinite
  }

  span:nth-child(1) {
    animation-delay 0.13s
  }

  span:nth-child(2) {
    animation-delay 0.26s
  }

  span:nth-child(3) {
    animation-delay 0.39s
  }

  span:nth-child(4) {
    animation-delay 0.52s
  }

  span:nth-child(5) {
    animation-delay 0.65s
  }

  span:last-child {
    margin-right 0px
  }

  @keyframes load {
    0% {
      opacity 1
      transform scale(1.2)
    }
    100% {
      opacity .2
      transform scale(.2)
    }
  }
</style>
