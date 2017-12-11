<template>
  <transition class="singer-wrapper" :name="slider"></transition>
</template>

<script type="text/ecmascript-6">

</script>

<style lang="stylus" rel="stylesheet/stylus">
  .singer-wrapper
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
  .slider-enter-active, .slider-enter-leave
    transition: all 0.3s
  .slider-enter, .slider-leave-to
    transform: translate3d(100%, 0, 0)

</style>
