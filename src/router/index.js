import Vue from 'vue'
import Router from 'vue-router'
import Rank from 'components/rank/rank'
import Recommend from 'components/recommend/recommend'
import Search from 'components/search/search'
import Singer from 'components/singer/singer'
import SingerDetail from 'components/singerDetail/singerDetail'
import SongSheet from 'components/songSheet/songSheet'
import TopList from 'components/top-list/top-list'

Vue.use(Router) // 注册

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id', // 注意冒号
          component: SongSheet
        }
      ]
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [ // 子路由
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    }
  ]
})
