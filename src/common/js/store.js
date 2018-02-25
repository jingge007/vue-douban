export function saveToLocal(id, key, val) {                  // 将数据缓存到本地
  let userInfo = window.localStorage._doubanMovie_
  if (!userInfo) {
    userInfo = {}
    userInfo[id] = {}
  } else {
    userInfo = JSON.parse(userInfo)           // JSON.parse() 方法用于将一个 JSON 字符串转换为对象。
    if (!userInfo[id]) {
      userInfo[id] = {}
    }
  }
  userInfo[id][key] = val
  window.localStorage._doubanMovie_ = JSON.stringify(userInfo)           // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
}

export function loadFromLocal(id, key, def) {                     // 获取缓存在本地的数据
  let userInfo = window.localStorage._doubanMovie_
  if (!userInfo) {
    return def
  }
  userInfo = JSON.parse(userInfo)[id]
  if (!userInfo) {
    return def
  }
  let ret = userInfo[key]
  return ret || def
}
