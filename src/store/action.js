/**
 * Created by jeffywin on 2017/12/11.
 */
import * as types from './mutation-types'

export const playInfo = function ({commit}, {list, index}) {
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_SEQUENCELIST, list)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
