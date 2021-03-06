/**
 * Created by jeffywin on 2017/12/11.
 */
import * as types from './mutation-types'

const mutations = {
   [types.SET_SINGER](state, singer) {
     state.singer = singer
   },
   [types.SET_PLAYING_STATE](state, flag) {
     state.playing = flag
   },
   [types.SET_FULL_SCREEN](state, flag) {
     state.fullScreen = flag
   },
   [types.SET_PLAYLIST](state, list) {
     state.playlist = list
   },
   [types.SET_SEQUENCELIST](state, list) {
     state.sequenceList = list
   },
   [types.SET_PLAY_MODE](state, mode) {
     state.mode = mode
   },
   [types.SET_CURRENT_INDEX](state, index) {
     state.currentIndex = index
   },
   [types.SET_SONGSHEET](state, list) {
     state.songSheet = list
   },
   [types.SET_RANK_MUSICLIST](state, list) {
    state.rankMusicList = list
   },
   [types.SET_SEARCH_HISTORY](state, history) {
     state.searchHistory = history
   }
}

export default mutations
