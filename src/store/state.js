/**
 * Created by jeffywin on 2017/12/11.
 */
import {playMode} from 'common/js/config'

const state = { // 定义数据的地方
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1
}

export default state
