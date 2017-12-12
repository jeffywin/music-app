<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <Scroll
      class="list"
      :data="songs"
      :probe-type="probeType"
      ref="songlist"
      :listen-scroll="listenScroll"
      @scrollMove="inscrollMove"
    >
      <div class="song-list-wrapper" >
        <song-list :songs="songs"></song-list>
      </div>
    </Scroll>

  </div>
</template>

<script>
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'

const TOP_HEIGHT = 38

export default {
  created() {
    this.probeType = 3
    this.listenScroll = true // scroll子组件派发scrollMove事件,拿到移动距离
  },
  data() {
    return {
      scrolY: -1,
      maxScrollHeight: 0
    }
  },
  mounted() {
    this.clientHeight = this.$refs.bgImage.clientHeight
    this.maxScrollHeight = -this.clientHeight + TOP_HEIGHT
    this.$refs.songlist.$el.style.top = `${this.clientHeight}px`
  },
  watch: { // watch 是对象
    scrolY(newY) {
      let maxHeight = Math.max(this.maxScrollHeight, newY) // 滚动距离小于最大距离时候 layer层停止滚动
      this.$refs.layer.style['transform'] = `translate3d(0,${maxHeight}px,0)`
      let zIndex = 0
      let scale = 1
      const percent = Math.abs(newY / this.clientHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      }
      if (newY < maxHeight) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${TOP_HEIGHT}px`
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style['transform'] = `scale(${scale})`
      this.$refs.bgImage.style.zIndex = zIndex
    }
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    inscrollMove(pos) { // 子组件scroll派发的事件
      this.scrolY = pos.y
    }
  },
  computed: { // 计算属性
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  components: {
    SongList,
    Scroll
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>