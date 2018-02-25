<!--搜索框组件-->
<template>
  <div class="searchBox">
    <div class="box">
      <i class="icon-search"></i>
      <input type="text"
             class="box-item"
             :placeholder="placeholder"
             v-model="query"
             ref="query"
             @focus="focusInput"
             @blur="blurInput"
      >
      <i class="icon-close" v-show="query" @click="clear"></i>
    </div>
    <span class="cancel" @click="back">取消</span>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        query: ''
      }
    },
    props: {
      placeholder: {
        type: String,
        default: '搜索电影 / 影人'
      },
      tagSearch: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      back() {          // 点击取消就返回上一层路由
        this.$router.back()
      },
      setQuery(query) {
        this.query = query
      },
      clear() {            // 点击关闭按钮清空输入框
        this.query = ''
      },
      blur() {            // 让输入框失去焦点
        this.$refs.query.blur()
      },
      focus() {               // 让输入框获取焦点
        this.$refs.query.focus()
      },
      focusInput() {           // 输入框获取焦点时
        this.$emit('focusInput')
      },
      blurInput() {           // 输入框失去焦点时
        this.$emit('blurInput')
      }
    },
    watch: {
      query(newQuery) {
        if (!this.tagSearch) {          // 节流操作
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            this.$emit('query', newQuery)
          }, 200)
        } else {           // 标签搜索不需要节流
          this.$emit('query', newQuery)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .searchBox {
    box-sizing border-box
    width: 100%
    display flex
    align-items: center
    padding 10px 0 10px 20px
    height: 50px
    line-height 50px
    background-color: #42bd56
  }

  .searchBox .icon-search {
    position: absolute;
    top: 8px;
    left: 12px;
    font-size: 16px;
    color: #777;
  }

  .seach-item {
    position: relative
  }

  .searchBox .box {
    flex 8
    height: 30px
    line-height: 30px
    border-radius 30px
    padding 0 25px 0 35px
    background-color: #fff
    color #333
    font-size 14px
    caret-color #42bd56
    position: relative
  }

  .searchBox .box-item {
    background-color: #fff
    height: 30px
    line-height: 30px
    border-radius 8px
    outline none
    width: 100%
    border 0
  }

  .box-item ::placeholder {
    color #777
  }

  .searchBox .cancel {
    flex 2
    text-align: center
    font-size 16px
    color #fff
  }

  .searchBox .icon-close {
    position: absolute;
    top: 4px;
    right: 2px;
    font-size: 14px;
    color: #000;
    padding 4px
  }
</style>
