<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          @scrollToEnd="searchMove"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIcon(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasmore"></loading>
    </ul>
    <div class="no-result-wrapper">
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  const PERPAGE = 20

  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import {mapMutations} from 'vuex'

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        pullup: true,
        hasmore: true
      }
    },
    methods: {
      search() {
        this.hasmore = true
        search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.genResult(res.data)
            this.checkRet(res.data)
          }
        })
      },
      genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: 'singer'}}) // 给data.zhida 增加了 type: singer
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      getIcon(item) {
        if (item.type === 'singer') {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === 'singer') {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      checkRet(data) { // 看是否要上拉刷新 判断当前数据和总数据对比
        const song = data.song
        if ((song.curpage * PERPAGE + song.curnum) >= song.totalnum || !song.list.length) {
          this.hasmore = false
        }
      },
      searchMove() { // 上拉刷新
        if (!this.hasmore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this.genResult(res.data))
            this.checkRet(res.data)
          }
        })
      },
      selectItem(item) { // 点击列表 歌曲: 跳转播放  歌手: 跳到歌手页面 singer 组件
        if (item.type === 'singer') {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${item.singermid}`
          })
          this.setSinger(singer)
        }
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    watch: {
      query(newQuery) {
        this.search(newQuery)
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
