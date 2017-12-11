/**
 * Created by jeffywin on 2017/12/11.
 */
import * as types from './mutation-types'

const mutations = {
   [types.SET_SINGER](state, singer) {
     state.singer = singer
   }
}

export default mutations
