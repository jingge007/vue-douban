import {saveToLocal, loadFromLocal} from './store.js'

const USER_ID = 'douban'                              // 定义缓存的用户id
const SEARCH_KEY = '_search_'                        // 搜索历史的键名
const COMMENT_KEY = '_comment_'                     // 电影短评的点赞键名
const WATCHED_KEY = '_watched_'                    // 已经看过的电影
const WANTED_KEY = '_wanted_'                     // 想看的电影
const CELEBRITY_KEY = '_celebrity_'              // 收藏的影人
const SEARCH_MAX_LENGTH = 20                    // 搜索结果缓存的最大长度
const COMMENT_MAX_LENGTH = 300                 // 缓存电影短评的点赞最大长度
const WATCHED_MAX_LENGTH = 300                // 缓存已经看过的电影的最大长度
const WANTED_MAX_LENGTH = 300                // 缓存想看的电影的最大长度
const CELEBRITY_MAX_LENGTH = 300


// 缓存看过的电影数据到本地
export function saveWatchedMovie(movie) {
  const maxLen = WATCHED_MAX_LENGTH
  let movies = loadFromLocal(USER_ID, WATCHED_KEY, [])           // 获取不到返回空数组
  const index = movies.findIndex((item) => {                    // 查找缓存数组中是否有包含添加的数据，返回索引
    return item.id === movie.id
  })
  if (index === -1) {                                         // 当没有缓存数据时就把当前的数据缓存到本地
    movies.push(movie)
    if (maxLen && movies.length > maxLen) {                 // 当缓存的数据超过最大的长度时就移出先前缓存的数据
      movies.shift()                                       // shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
    }
  } else {                                               // 如果当前缓存的数据已经存在就移除
    movies.splice(index, 1)                             // splice() 方法可删除从 index 处开始的零个或多个元素，并且用参数列表中声明的一个或多个值来替换那些被删除的元素。
  }
  saveToLocal(USER_ID, WATCHED_KEY, movies)            // 将数据缓存到本地
  return movies
}

// 从缓存中获取看过的电影数据
export function loadWatchedMovie() {
  return loadFromLocal(USER_ID, WATCHED_KEY, [])
}


// 缓存想看的电影数据到本地
export function saveWantedMovie(movie) {
  const maxLen = WANTED_MAX_LENGTH
  let movies = loadFromLocal(USER_ID, WANTED_KEY, [])
  const index = movies.findIndex((item) => {
    return item.id === movie.id
  })
  if (index === -1) {
    movies.push(movie)
    if (maxLen && movies.length > maxLen) {
      movies.shift()
    }
  } else {
    movies.splice(index, 1)
  }
  saveToLocal(USER_ID, WANTED_KEY, movies)
  return movies
}

// 从缓存中获取想看的电影数据
export function loadWantedMovie() {
  return loadFromLocal(USER_ID, WANTED_KEY, [])
}


// 缓存电影短评的点赞数据
export function saveComment(id) {
  const maxLen = COMMENT_MAX_LENGTH
  let comments = loadFromLocal(USER_ID, COMMENT_KEY, [])       // 获取不到数据就返回空数组
  const index = comments.findIndex((item) => {
    return item === id
  })
  if (index === -1) {           // 当前要缓存数据不存在时，就把数据缓存到本地
    comments.push(id)
    if (maxLen && comments.length > maxLen) {          // 当缓存数据超过最大的长度时就移出前面的数据
      comments.shift()
    }
  } else {                     // 当前要缓存数据存在时，就把缓存的数据移出
    comments.splice(index, 1)
  }
  saveToLocal(USER_ID, COMMENT_KEY, comments)
  return comments
}

// 从本地缓存中读取电影短评的点赞数据
export function loadComment() {
  return loadFromLocal(USER_ID, COMMENT_KEY, [])
}


// 将数据插入缓存数组中
function insertArray(arr, val, compare, maxLen) {            // 查找缓存数组中是否包含添加的函数，返回索引
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {                    // 如果当前的缓存数组中有添加函数，就移除
    arr.splice(index, 1)
  }
  arr.unshift(val)                 // 将最新数据添加到最前面
  if (maxLen && arr.length > maxLen) {           // 当缓存的数据超过最大长度时移除最后的数据
    arr.pop()
  }
}

// 将信息从缓存数组中删除
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 保存搜索的结果
export function saveSearch(query) {
  let searches = loadFromLocal(USER_ID, SEARCH_KEY, [])            // 获取不到就返回空数组
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  saveToLocal(USER_ID, SEARCH_KEY, searches)        // 将数据缓存到数组中
  return searches
}

// 从缓存中读取搜索结果的数据
export function loadSearch() {
  return loadFromLocal(USER_ID, SEARCH_KEY, [])
}


// 从缓存中删除搜索结果的数据
export function deleteSearch(query) {
  let searches = loadFromLocal(USER_ID, SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  saveToLocal(USER_ID, SEARCH_KEY, searches)
  return searches
}


// 删除全部缓存的搜索数据
export function clearSearch() {
  saveToLocal(USER_ID, SEARCH_KEY, [])
  return []
}


// 收藏影人的数据
export function saveCelebrity(celebrity) {
  const maxLen = CELEBRITY_MAX_LENGTH
  let celebrities = loadFromLocal(USER_ID, CELEBRITY_KEY, [])
  const index = celebrities.findIndex((item) => {            // 查找缓存数组中是否包含添加的数据，返回索引
    return item.id === celebrity.id
  })
  if (index === -1) {
    celebrities.push(celebrity)
    if (maxLen && celebrities.length > maxLen) {
      celebrities.shift()
    }
  } else {                            // 如果已经存在被标记的id,则代表用户进行反操作，取消喜欢
    celebrities.splice(index, 1)
  }
  saveToLocal(USER_ID, CELEBRITY_KEY, celebrities)         // 存入缓存
  return celebrities
}

// 从缓存中读取收藏影人的数据
export function loadCelebrity() {
  return loadFromLocal(USER_ID, CELEBRITY_KEY, [])
}


