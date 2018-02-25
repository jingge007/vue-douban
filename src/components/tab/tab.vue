<!--底部通栏组件-->
<template>
  <div class="tab" v-show="tabFlag">
    <router-link to="/moiveshow" tag="div" class="tab-item">
      <span class="tab-icon">
        <!--<i class="icon-video-camera"></i>-->
        <i class="icon-collect"></i>
      </span>
      <span class="tab-link">热映</span>
    </router-link>
    <router-link to="/rank" tag="div" class="tab-item">
      <span class="tab-icon">
        <i class="icon-stats-bars"></i>
      </span>
      <span class="tab-link">排行</span>
    </router-link>
    <router-link to="/video" tag="div" class="tab-item">
      <span class="tab-icon">
        <i class="icon-video-camera"></i>
      </span>
      <span class="tab-link">视频</span>
    </router-link>
    <router-link to="/user" tag="div" class="tab-item">
      <span class="tab-icon">
        <i class="icon-user"></i>
      </span>
      <span class="tab-link">我的</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      tabFlag: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .tab {
    position: fixed
    width 100%
    bottom 0
    border-top 1px solid #42bd56
    display flex
    height: 60px
    font-size 14px
    background-color: #fff;
    z-index 9990
  }

  .tab .tab-item {
    flex 1
    text-align: center
    display flex
    flex-direction column
    align-items center
    justify-content center
  }

  .tab-item .tab-icon {
    font-size 22px
    color #777
  }

  .tab-item .tab-link {
    font-size 13px
    color #777
  }

  .tab-item.active .tab-icon {
    color #42bd56
  }

  .tab-item.active .tab-link {
    color #42bd56
  }
</style>
