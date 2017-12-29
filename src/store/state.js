/**
 * Created by jeffywin on 2017/12/11.
 */
import {playMode} from 'common/js/config'

const state = { // 定义数据的地方
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [], // 播放列表
  sequenceList: [], // 歌曲顺序列表
  mode: playMode.sequence,
  currentIndex: -1,
  songSheet: {}, // 歌单详情
  rankMusicList: {},
  searchHistory: {}
}

export default state
