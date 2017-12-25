<template>
    <div class="rank" ref="rank">
      <scroll class="toplist" :data="toplist" ref="toplist">
        <ul>
          <li class="item" v-for="item in toplist" @click="songDetail(item)">
            <div class="icon">
              <img width="100%" height="100%" v-lazy="item.picUrl">
            </div>
            <ul class="songlist">
              <li class="song" v-for="(list,index) in item.songList">
                <span>{{index+1}}</span>
                <span>{{list.songname}}-{{list.singername}}</span>
              </li>
            </ul>
          </li>
        </ul>
        <div class="loading-container" v-show="!toplist.length">
          <loading></loading>
        </div>
      </scroll>
      <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getTopList, getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        toplist: [],
        musicList: []
      }
    },
    created() {
      this._getTopList()
      this._getMusicList()
    },
    methods: {
      songDetail(item) {
        this.setRankList(item)
        this.$router.push({
          path: `/rank/${item.id}`
        })
      },
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : 0
        this.$refs.rank.style.bottom = bottom
        this.$refs.toplist.refresh()
      },
      _getTopList() {
        getTopList().then((res) => {
          if (res.code === ERR_OK) {
            this.toplist = res.data.topList
          }
        })
      },
      _getMusicList() {
        getMusicList().then((res) => {
          if (res.code === ERR_OK) {
            this.musicList = res.data
          }
        })
      },
      ...mapMutations({
        setRankList: 'SET_RANK_MUSICLIST'
      })
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
