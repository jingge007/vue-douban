<!--正在热映与即将上映的开关切换组件-->
<template>
  <ul class="switches">
    <li class="switch-item"
        v-for="(item,index) in switches"
        :class="{'active':currentIndex===index,'small-font':smallFont === true}"
        @click="switchItem(index)"
    >
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      switches: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      },
      smallFont: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      switchItem(index) {      // 当点击切换开关时，将点击的index传到父组件
        this.$emit('switch', index)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .switches {
    position: relative
    z-index 200
    background-color: #fff
    display: flex
    align-items center
    width: 100%
  }

  .switches .switch-item {
    flex 1
    text-align: center
    padding 15px
    font-size 16px
    color #777
    border-bottom 1px solid transparent
  }

  .switch-item.small-font {
    padding 14px 5px
    font-size 12px
  }

  .switch-item.active {
    color #42bd56
    border-bottom 1px solid #42bd56
  }

  .switch-item.small-font {
    padding: 14px 5px
    font-size 12px
  }
</style>
