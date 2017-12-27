<template>
    <div ref="wrapper">
      <slot></slot>
    </div>
</template>

<script type="text/ecmascript-6">
 import BScroll from 'better-scroll'

 export default {
   props: {
     probeType: {
       type: Number,
       default: 1
     },
     click: {
       type: Boolean,
       default: true
     },
     data: {
       type: Array,
       default: null
     },
     listenScroll: {
       type: Boolean,
       default: false
     },
     pullup: { // 上拉刷新
       type: Boolean,
       default: false
     }
   },

   mounted() {
     setTimeout(() => {
       this._initScroll()
     }, 20)
   },

   methods: {
     _initScroll() {
       if (!this.$refs.wrapper) {
         return
       }
       this.scroll = new BScroll(this.$refs.wrapper, {
         probeType: this.probeType,
         click: this.click
       })
       if (this.listenScroll) {
         this.scroll.on('scroll', (pos) => {
           this.$emit('scrollMove', pos)
         })
       }
       if (this.pullup) {
         this.scroll.on('scrollEnd', () => { // 当停止滚动的时候
           if (this.scroll.y <= this.scroll.maxScrollY + 50) {
             this.$emit('scrollToEnd') // 派发滚动到底部事件
           }
         })
       }
     },
     refresh() {
       this.scroll && this.scroll.refresh()
     },
     enable() {
       this.scroll && this.scroll.enable()
     },
     disable() {
       this.scroll && this.scroll.disable()
     },
     scrollTo() { // 代理better-scroll 中的 scrollTo 方法 滚动到指定的位置
       this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
     },
     scrollToElement() { // 滚动到指定的目标元素
       this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
     }
   },
   watch: {
     data() {
       setTimeout(() => {
         this.refresh()
       }, 20)
     }
   }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
