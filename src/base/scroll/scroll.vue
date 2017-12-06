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
     },
     refresh() {
       this.scroll && this.scroll.refresh()
     },
     enable() {
       this.scroll && this.scroll.enable()
     },
     disable() {
       this.scroll && this.scroll.disable()
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
