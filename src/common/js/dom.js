/**
 * Created by jeffywin on 2017/8/3.
 */
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }

  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData(el, name, val) { // 假如有val,设置它的data-index 属性,假如没传,就获取它的data-index属性
  let preFix = 'data-'
  if (val) {
    return el.setAttribute(preFix + name, val)
  } else {
    return el.getAttribute(preFix + name)
  }
}

export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function debounce(func, delay) { // 节流函数,防止过多请求数据,搜索的时候
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
