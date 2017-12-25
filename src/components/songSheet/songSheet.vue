<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  // import {createSong} from 'common/js/song'
  import {ERR_OK} from 'api/config'
  import {getSongList} from 'api/recommend'

  export default {
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList()
    },
    computed: { // 计算属性
      title() {
        return this.songSheet.dissname
      },
      bgImage() {
        return this.songSheet.imgurl
      },
      ...mapGetters([
        'songSheet'
      ])
    },
    methods: {
      _getSongList() {
        if (!this.songSheet.dissid) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.songSheet.dissid).then((res) => {
          if (res.code === ERR_OK) {
            console.log(res)
          }
        })
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
