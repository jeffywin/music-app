<template>
    <div class="player" v-show="playlist.length>0">
      <transition name="normal">
        <div class="normal-player" v-show="fullScreen" v-if="currentSong">
          <div class="background">
            <img width="100%" height="100%" :src="currentSong.image">
          </div>
          <div class="top">
            <div class="back">
              <i class="icon-back" @click="miniPlayer"></i>
            </div>
            <h1 class="title" v-html="currentSong.name"></h1>
            <h2 class="subtitle" v-html="currentSong.singer"></h2>
          </div>
          <div class="middle" @touchstart="middleTouchStart" @touchmove="middleTouchMove" @touchend="middleTouchEnd">
            <div class="middle-l" ref="middleL">
              <div class="cd-wrapper">
                <div class="cd" :class="cdPlay">
                  <img class="image" :src="currentSong.image">
                </div>
              </div>
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{playingLyric}}</div>
              </div>
            </div>
            <scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref="lyricList">
              <div class="lyric-wrapper">
                <div v-if="currentLyric">
                  <p ref="lyricLine"
                     class="text"
                     :class="{'current': currentLineNum ===index}"
                     v-for="(item, index) in currentLyric.lines"
                  >{{item.txt}}</p>
                </div>
              </div>
            </scroll>
          </div>
          <div class="bottom">
            <div class="dot-wrapper">
              <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
              <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
            </div>
            <div class="progress-wrapper">
              <span class="time time-r">{{format(currentTime)}}</span>
              <div class="progress-bar-wrapper">
                <progress-bar :present="present" @persentChange="presentChange"></progress-bar>
              </div>
              <span class="time time-l">{{format(currentSong.duration)}}</span>
            </div>
            <div class="operators">
              <div class="icon i-left" @click="modeChange">
                <i :class="playMode"></i>
              </div>
              <div class="icon i-left" :class="disableCls">
                <i @click="prev" class="icon-prev"></i>
              </div>
              <div class="icon i-center" :class="disableCls">
                <i :class="normalPlay" @click="togglePlay"></i>
              </div>
              <div class="icon i-right" :class="disableCls">
                <i @click="next" class="icon-next"></i>
              </div>
              <div class="icon i-right">
                <i class="icon icon-sequence"></i>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <transition name="mini">
        <div class="mini-player" v-show="!fullScreen" @click="normalPlayer" v-if="currentSong">
          <div class="icon">
            <img width="40" height="40" :src="currentSong.image">
          </div>
          <div class="text">
            <h2 class="name" v-html="currentSong.name"></h2>
            <p class="desc" v-html="currentSong.singer"></p>
          </div>
          <div class="control">
            <i :class="miniIcon" @click.stop="toggleMiniP"></i>
          </div>
          <div class="control">
            <i class="icon-playlist"></i>
          </div>
        </div>
      </transition>
      <audio ref='audio' :src="currentSong.url" v-if="currentSong" @canplay="ready" @timeupdate="updateTime" @ended="end"></audio>
    </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import {playMode} from 'common/js/config'
  import {shuffle} from 'common/js/dom'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll'

  export default {
    created() {
      this.touch = {}
    },
    data() {
      return {
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: ''
      }
    },
    computed: {
      normalPlay() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      cdPlay() { // 唱片转动
        return this.playing ? 'play' : 'play pause'
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      present() {
        return this.currentTime / this.currentSong.duration
      },
      playMode() { // 播放模式 样式切换
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : this.mode === playMode.random ? 'icon-random' : ''
      },
      ...mapGetters([
        'playing',
        'fullScreen',
        'currentIndex',
        'playlist',
        'currentSong',
        'mode',
        'sequenceList'
      ])
    },
    methods: {
      miniPlayer() {
        this.setFullScreen(false)
      },
      normalPlayer() {
        this.setFullScreen(true)
      },
      toggleMiniP() { // 通过this.playing 来提交mutation ,最终控制播放音乐的是 audi.play()
        if (!this.songReady) {
          return
        }
        this.setPlayingState(!this.playing)
      },
      togglePlay() {
        if (!this.songReady) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
        this.setPlayingState(!this.playing)
      },
      next() { // 下一首歌
        if (!this.songReady) {
          return
        }
        let index = this.currentIndex + 1
        if (index === this.playlist.length) { // 最后一首歌的时候
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) { // 假如暂停时,切换后变为播放
          this.togglePlay()
        }
        this.songReady = false
      },
      prev() { // 上一首歌
        if (!this.songReady) {
          return
        }
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.toggleMiniP()
        }
        this.songReady = false
      },
      end() { // 播放结束
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      ready() { // 只有当歌曲开始播放时候,才为true,防止过度快速点击
        this.songReady = true
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      format(interval) {
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      presentChange(present) {
        const currentTime = this.currentSong.duration * present
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlay()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime)
        }
      },
      modeChange() { // 点击切换模式
        const mode = (this.mode + 1) % 3
        let list = null
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
          this.setSequence(list)
        } else {
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setMode(mode) // 改变播放模式
        this.setPlaylist(list) // 改变播放列表
      },
      getLyric() {
        this.currentSong.getLyric().then((res) => {
          if (this.currentSong.lyric !== res) {
            return
          }
          this.currentLyric = new Lyric(res, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        })
      },
      handleLyric(lineNum) { // 处理歌词的回调函数
        let liNum = lineNum.lineNum
        this.currentLineNum = liNum
        if (liNum > 5) {
          let lineN = this.$refs.lyricLine[liNum - 5] // 第5行歌词
          this.$refs.lyricList.scrollToElement(lineN, 1000) // 每隔1秒往上滑到第5个歌词节点
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = lineNum.txt
      },
      middleTouchStart(e) { // 左右滑动 歌词
        this.touch.initiated = true
        let touches = e.touches[0]
        this.touch.startX = touches.pageX
        this.touch.startY = touches.pageY
      },
      middleTouchMove(e) { // 往左滑是负数  往右是正数
        if (!this.touch.initiated) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX // 滑动的距离
        // const deltaY = e.touches[0].page - this.touch.startY
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.persent = offsetWidth / -window.innerWidth
        this.$refs.lyricList.$el.style['transform'] = `translate3D(${offsetWidth}px, 0, 0)`
      },
      middleTouchEnd() {
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.persent > 0.1) { // 往右移动
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else { // 往左移动
          if (this.touch.persent < 0.3) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        this.$refs.lyricList.$el.style['transform'] = `translate3D(${offsetWidth}px, 0, 0)`
        this.$refs.middleL.style.opacity = opacity
      },
      resetCurrentIndex(list) {
        let index = list.findIndex((item) => { // 找出id相同的索引
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
       ...mapMutations({ // 全屏
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setMode: 'SET_PLAY_MODE',
        setSequence: 'SET_SEQUENCELIST', // 播放顺序
        setPlaylist: 'SET_PLAYLIST' // 播放列表
      })
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (!newSong) {
          return
        }
//        if (newSong.id === oldSong.id) {
//          return
//        }
        this.$nextTick(() => {
          this.$refs.audio.play()
          this.getLyric()
        })
      },
      playing(newPlaying) {
        this.$nextTick(() => {
          const audio = this.$refs.audio
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    components: {
      ProgressBar,
      Scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
