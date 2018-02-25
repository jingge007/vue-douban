<template>
  <div class="star" :class="starType">
    <div class="no-score" v-if="!score">暂无评分</div>
    <span class="star-item" v-if="score || needNullStar" v-for="item in itemClass" :class="item"></span>
    <span class="show-score" v-if="showScore && score">{{normalizeScore}}分</span>
  </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5        // 定义星星的长度
  const CLS_ON = 'on'
  const CLS_HALF = 'half'
  const CLS_OFF = 'off'
  export default {
    props: {
      size: {
        type: Number,
        default: 24
      },
      showScore: {
        type: Boolean,
        default: false
      },
      score: {
        type: Number,
        default: 0
      },
      needNullStar: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      normalizeScore() {       // 电影评分数据的末尾补零
        let len = this.score.toString().length
        if (len < 2) {
          return `${this.score}.0`
        }
        return this.score
      },
      starType() {          // 星星评分的图片大小
        return 'star-' + this.size
      },
      itemClass() {
        let result = []
        let score = Math.floor(this.score) / 2
        let hasDecimal = score % 1 !== 0
        let integer = Math.floor(score)
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON)
        }
        if (hasDecimal) {
          result.push(CLS_HALF)
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF)
        }
        return result
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "~@/common/stylus/mixin.styl"

  .star {
    font-size 0
  }

  .star .no-score {
    width: 100%
    font-size 12px
  }

  .star .no-score.block {
    display block
    font-size 12px
    text-align: center
    padding 15px 0 10px 0
  }

  .star .show-score {
    display: inline-block
    font-size 12px
    margin-left: 5px
  }

  .star .star-item {
    display inline-block
    background-repeat no-repeat
  }

  .star.star-24 .star-item {
    height: 10px
    width: 10px
    margin-right 3px
    background-size 10px 10px
  }

  .star.star-24 .star-item:last-child {
    margin-right 0
  }

  .star.star-24 .star-item.on {
    bg-image('star24_on')
  }

  .star.star-24 .star-item.half {
    bg-image('star24_half')
  }

  .star.star-24 .star-item.off {
    bg-image('star24_off')
  }

  .star.star-36 .star-item {
    height: 15px
    width: 15px
    margin-right 6px
    background-size 15px 15px
  }

  .star.star-36 .star-item:last-child {
    margin-right 0
  }

  .star.star-36 .star-item.on {
    bg-image('star36_on')
  }

  .star.star-36 .star-item.half {
    bg-image('star36_half')
  }

  .star.star-36 .star-item.off {
    bg-image('star36_off')
  }
</style>
