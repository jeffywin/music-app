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
