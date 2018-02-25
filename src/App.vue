<template>
  <div id="app">
    <keep-alive>
      <router-view @hasLoad="hasLoad" v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view @hasLoad="hasLoad" v-if="!$route.meta.keepAlive"></router-view>
    <tab></tab>
    <startup v-if="!loadingFlag" @select="selectItem"></startup>
  </div>
</template>

<script>
  import startup from 'base/startup/startup.vue'
  import tab from 'components/tab/tab.vue'

  export default {
    data() {
      return {
        loadingFlag: false
      }
    },
    methods: {
      hasLoad() {
        setTimeout(() => {
          this.loadingFlag = true
        }, 4000)
      },
      selectItem() {
        this.loadingFlag = true
      }
    },
    components: {
      startup,
      tab
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>

</style>
