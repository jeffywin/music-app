<template>
  <transition name="slide">
    <div class="singer-wrapper"></div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'

  export default {
    created() { // this.$store.state.singer 等同于 this.singerInfo(因为getters封装了)
    },
    computed: {
      ...mapGetters([
        'singerInfo'
      ])
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .singer-wrapper
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: #ccc
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>
