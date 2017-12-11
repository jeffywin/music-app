<!--suppress ALL -->
<template>
  <Scroll :data='data'
          class="listview"
          @scrollMove="inscrollMove"
          :listen-scroll="listenScroll"
          ref="listview"
          :probeType="probeType"
  >
    <ul>
      <li v-for='item in data' class="list-group" ref="groupList" >
         <h2 class="list-group-title">{{item.title}}</h2>
         <ul>
           <li v-for='group in item.items' class="list-group-item"  @click="select(group)">
              <img class="avatar" :src="group.avatar">
              <span class="name">{{group.name}}</span>
           </li>
         </ul>
      </li>
    </ul>
    <div class="list-shortcut"
         @touchstart.stop.prevent="moveTouchStart"
         @touchmove.stop.prevent="moveTouchMove"
    >
      <ul>
        <li v-for='(item, index) in rightList'
            class="item"
            :data-index="index"
            :class="{'current':currentIndex===index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </Scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getData} from 'common/js/dom'

const LIST_HEIGHT = 18 // 右侧字母高度
export default {
  data() {
    return {
      scrolY: -1,
      currentIndex: 0
    }
  },
  watch: { // 监听data变化,拿到listHeight
    data() {
      setTimeout(() => {
        this.calucate()
      }, 20)
    },
    scrolY(newY) {
      const listHeight = this.listHeight
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 中间 通过scroll派发的事件 传递距离 与 列表高度来对比 当处于某个列表中的时候 就加class
      for (let i = 0; i < listHeight.length - 1; i++) {
        let listHeight1 = listHeight[i]
        let listHeight2 = listHeight[i + 1]
        if (-newY < listHeight2 && -newY >= listHeight1) { // 一定要>=,不然点击的时候 获取不了
          this.currentIndex = i
          return
        }
      }
      // 底部
    }
  },
  created() {
    this.probeType = 3 // probeType=3 滚动动画运行过程中实时派发 scroll 事件
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  computed: {
    rightList() { // 计算属性
      return this.data.map((item) => {
        return item.title.substr(0, 1)
      })
    }
  },
  methods: {
    moveTouchStart(e) { // 右侧列表滑动获取index,传递给左侧 e.target 当前滑动点的html, e.touches[0] 属性
      this.touch.y1 = e.touches[0].pageY // 获取初始位置
      let startIndex = getData(e.target, 'index') // 获取开始触碰的 index
      this.touch.startIndex = startIndex
      this.scrollTo(startIndex)
    },
    moveTouchMove(e) {
      this.touch.y2 = e.touches[0].pageY // 获取结束位置
      let detla = (this.touch.y2 - this.touch.y1) / LIST_HEIGHT | 0 // | 0 向下取整
      let moveIndex = parseInt(this.touch.startIndex) + detla // 滑动首末的间距
      this.scrollTo(moveIndex)
    },
    inscrollMove(pos) { // scroll组件派发的scroll事件,来传递移动的距离
      this.scrolY = pos.y
    },
    select(item) { // 子组件派发事件
      this.$emit('select', item)
    },
    calucate() { // 获取各个字母歌手的列表高度
      this.listHeight = []
      const list = this.$refs.groupList
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight
        this.listHeight.push(height)
      }
    },
    scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      this.scrolY = -this.listHeight[index] // this.scrolY 滚动的距离
      this.$refs.listview.scrollToElement(this.$refs.groupList[index], 0) // 左侧页面相应跳转,time 0
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

