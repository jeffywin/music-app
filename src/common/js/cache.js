/**
 * Created by jeffywin on 2017/12/29.
 */
import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

function insertArray(arr, val, compare, maxLen) { // arr里插数据,假如存在,删掉原来的,把最新的插到前面 compare 比较当前数组存在val值
  const index = arr.findIndex(compare) // 查找当前数组中 是否有某个元素
  if (index === 0) { // 第一条数据
    return
  }
  if (index > 0) { // 不是第一条数据,把原来的数据删除,插入 unshift 新数据
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop() // 如果长度超了,删除最后一个元素
  }
}

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => { // query 插入 searches 数组中
    return item === query // query 在searches 数组里
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}
