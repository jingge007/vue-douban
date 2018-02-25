// 创建电影类（获取需要的数据）
export default class Movie {
  constructor({id, title, director, casts, collectCount, rating, image, date, pubdates, subtype}) {
    this.id = id                                                        // 电影的id
    this.title = title                                                 // 电影的标题
    this.director = director                                          // 电影的导演
    this.casts = casts                                               // 导演演员的信息
    this.collectCount = collectCount || 0                            // 电影累计观看人数
    this.rating = rating                                            // 电影的评分信息
    this.image = image                                             // 电影展示的图片
    this.date = date || 0                                         // 用于显示即将上映的电影是否待定
    this.pubdates = pubdates || ''                               // 用于电影详情的上映日期
    this.subtype = subtype || ''                                // 电影的类型
  }
}

export function createMovieList(movieList) {         // 创建包含电影类的通用电影信息列表
  let ret = []
  movieList.forEach((movie, index) => {
    ret.push(new Movie({
      id: movie.id,
      title: movie.title,
      director: filterDirector(movie.directors),
      casts: filterCasts(movie.casts),
      collectCount: movie.collect_count,
      rating: movie.rating.average,
      image: movie.images.large,
      date: filterDate(movie.mainland_pubdate, movie.pubdates),         // 该条目只用于首页的热映电影和即将上映电影
      pubdates: movie.pubdates
    }))
  })
  return ret
}

export function createRankList(rankList) {                  // 创建包含电影类的合适排行榜的电影信息列表
  let ret = []
  rankList.forEach((item) => {
    item = item.subject ? item.subject : item
    ret.push(new Movie({
      id: item.id,
      title: item.title,
      director: filterDirector(item.directors),
      casts: filterCasts(item.casts),
      rating: item.rating.average,
      image: item.images.large
    }))
  })
  return ret
}

export function createSearchList(movieList) {
  let ret = []
  movieList.forEach((movie, index) => {
    ret.push(new Movie({
      id: movie.id,
      title: movie.title,
      director: filterDirector(movie.directors),
      casts: filterCasts(movie.casts),
      rating: movie.rating.average,
      image: movie.images.small,
      pubdates: movie.pubdates,
      subtype: movie.subtype
    }))
  })
  return ret
}

// 预处理电影导演的信息，只获取主导演
function filterDirector(directors) {
  return directors.length ? directors[0].name : ''
}

// 预处理演员信息
function filterCasts(casts) {
  let ret = ''
  casts.forEach((item, index) => {
    if (index < casts.length - 1) {
      ret += `${item.name} / `
    } else {
      ret += item.name
    }
  })
  return ret
}

// 预处理时间信息
function filterDate(date, pubdates) {
  if (new Date().getTime() > new Date(date).getTime()) {       // 在上映电影列表中出现重映电影的情况
    // 判断该重映电影是否为待定日期
    let reg = /^\d{4}[-]\d{2}[-]\d{2}/
    for (let i = 0; i < pubdates.length; i++) {
      // 如果重映电影的日期数据完整，不需要待定显示
      if (pubdates[i].indexOf('中国大陆重映') !== -1 && reg.test(pubdates[i])) {             // test() 方法用于检测一个字符串是否匹配某个模式.
        return normalizDate(pubdates[i].match(reg)[0])         // match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
      }
    }
    return findShowTime(pubdates, '中国大陆重映')
  }
  if (!date) {             // 如果电影时间不确定，数据为空返回undefined
    return findShowTime(pubdates, '中国大陆')
  }
  return normalizDate(date)
}

// 获取电影上映的待定时间
function findShowTime(pubdates, key) {
  let month = ''
  let year = ''
  pubdates.forEach((item) => {
    let index = item.indexOf(key)
    if (index > -1) {
      if (!item.split('-')[1]) {        // 不存在月份信息
        year = item.split('-')[0].substr(0, 4)
      } else {
        month = (item.split('-'))[1].substr(0, 2)
        if (month.substr(0, 1) === '0') {
          month = month.substr(1, 1)
        }
      }
    }
  })
  if (!month) {
    return `${year}年待定`
  }
  return `${month}月待定`
}

// 格式化日期
function normalizDate(date) {
  const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  let currentWeek = week[new Date(date).getDay()]    // 获取当天的星期
  let time = `${date.split('-')[1]}月${date.split('-')[2]}日`;              // split() 方法用于把一个字符串分割成字符串数组
  if (time.substr(0, 1) === '0') {        // 月份去零
    time = time.substr(1)
  }
  let ret = time + ' ' + currentWeek
  if (needYear(date)) {              // 如果不是本年度电影
    return `${date.split('-')[0]}年${ret}`
  }
  return ret
}

// 判断是否需要显示年份
function needYear(date) {
  return parseInt(new Date(date).getFullYear()) > parseInt(new Date().getFullYear())
}
