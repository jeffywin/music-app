<template>
  <div class="singer" ref="singer">
    歌手
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  // import {getRecommend} from 'api/recommend'

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
            console.log(res)
         }
        })
      }
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
