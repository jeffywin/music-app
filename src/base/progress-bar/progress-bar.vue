<template>
  <div class="progress-bar" ref="progressBar" @click="proClcik">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart="ptouchstart"
           @touchmove="ptouchmove"
           @touchend="ptouchend"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  const CIRCLEWIDTH = 16

  export default {
    props: {
      present: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      ptouchstart(e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX // 开始拖动的位置
        this.touch.left = this.$refs.progress.clientWidth // 进度条的距离
      },
      ptouchmove(e) {
        if (!this.touch.initiated) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX // 手指移动偏移量
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - CIRCLEWIDTH, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      ptouchend() {
        this.touch.initiated = false
        this.triggerPersent()
      },
      proClcik(e) { // 点击拖动
        const rect = this.$refs.progressBar.getBoundingClientRect()
        this._offset(e.pageX - rect.left) // 点击的位置减去开始的位置
        this.triggerPersent()
      },
      triggerPersent() {
        const progressBarWdith = this.$refs.progressBar.clientWidth - CIRCLEWIDTH
        const persent = this.$refs.progress.clientWidth / progressBarWdith
        this.$emit('persentChange', persent)
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
      }
    },
    watch: {
      present(newPre) {
        if (newPre > 0 && !this.touch.initiated) {
          const progressBarWdith = this.$refs.progressBar.clientWidth - CIRCLEWIDTH
          const offsetWidth = newPre * progressBarWdith
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
