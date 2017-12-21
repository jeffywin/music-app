<template>
  <transition name="slide">
    <div class="singer-wrapper">
      <music-list
        :songs="songs"
        :title="title"
        :bgImage="bgImage"
      ></music-list>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    data() {
      return {
        songs: []
      }
    },
    created() { // this.$store.state.singer 等同于 this.singerInfo(因为getters封装了)
      this._getSingerDetail()
    },
    methods: {
      _getSingerDetail() {
        if (!this.singerInfo.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singerInfo.id).then((res) => {
          if (res.code === ERR_OK) {}
            this.songs = this._normalizeSongs(res.data.list)
        })
      },
      _normalizeSongs(list) { // 方法目的: 数据进来,循环列表,生成自己想要的歌曲列表
        let ret = []
        list.forEach((res) => {
          let {musicData} = res
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData)) // 工厂模式 实例化 歌曲信息,包括url id img 等
          }
        })
        return ret
      }
    },
    computed: {
      title() {
        return this.singerInfo.name
      },
      bgImage() {
        return this.singerInfo.avatar
      },
      ...mapGetters([
        'singerInfo'
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer-wrapper
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>
