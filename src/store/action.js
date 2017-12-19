/**
 * Created by jeffywin on 2017/12/11.
 */
import * as types from './mutation-types'
import {shuffle} from 'common/js/dom'
import {playMode} from 'common/js/config'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
export const playInfo = function ({commit, state}, {list, index}) {
  if (state.mode === playMode.random) { // 随机模式时点歌 会点不对歌,因为是顺序列表时的歌,因此要判断随机模式
    let randomlist = shuffle(list)
    commit(types.SET_PLAYLIST, randomlist)
    index = findIndex(randomlist, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_SEQUENCELIST, list)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function({commit}, {list}) {
  let randomlist = shuffle(list)
  commit(types.SET_PLAYLIST, randomlist)
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_SEQUENCELIST, list)
  commit(types.SET_CURRENT_INDEX, 0) // 从randomlist第一个开始播放
}
