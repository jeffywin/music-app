<template>
  <div class="singer" ref="singer">
    <listview :data='singers'></listview>
  </div>
</template>

<script>
  import listview from 'base/listView/listview'
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'

  const HOT_NAME = '热门'
  const HOT_LEN = 10
  export default {
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
        list.forEach((item, index) => {
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
          map[key].items.push(new Singer({
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
      }
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
