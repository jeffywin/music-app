<!--suppress ALL -->
<template>
  <div class="singer" ref="singer">
    <listview :data='singers' @select="selectItem" ref="listview"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
  import listview from 'base/listView/listview'
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const HOT_NAME = '热门'
  const HOT_LEN = 10
  export default {
    mixins: [playlistMixin],
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._doneSingerList(res.data.list)
          }
        })
      },
      _doneSingerList(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => { // 热门
          if (index < HOT_LEN) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({ // 歌手
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        let hot = []
        let letters = []
        for (let key in map) {
          if (map[key].title === HOT_NAME) {
            hot.push(map[key])
          } else if (map[key].title.match(/[a-zA-Z]/)) {
              letters.push(map[key])
            }
        }

        letters.sort((a, b) => {
          return a.title.charCodeAt() - b.title.charCodeAt()
        })
        return hot.concat(letters)
      },
      handlePlaylist(playlist) {
        const bottom = this.playlist.length > 0 ? '60px' : 0
        this.$refs.singer.style.bottom = bottom
        this.$refs.listview.refresh() // 直接调用子组件的refresh() 方法
      },
      selectItem(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        // this.$store.commit('SET_SINGER', singer)
        this.setSinger(singer)
      }, // 接收子组件listview的id,跳转子路由
      ...mapMutations({
         setSinger: 'SET_SINGER'
      })
    },
    components: {
      listview
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
