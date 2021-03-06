/**
 * Created by jeffywin on 2017/12/11. getters 对取数据的封装
 */
export const singerInfo = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const mode = state => state.mode

export const sequenceList = state => state.sequenceList

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playlist[state.currentIndex]
}

export const songSheet = state => state.songSheet // 首页歌单详情

export const rankMusicList = state => state.rankMusicList // 排行歌单详情
