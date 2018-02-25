import {loadWatchedMovie, loadWantedMovie, loadComment, loadSearch, loadCelebrity} from '../common/js/cache.js'

const state = {
  movie: {},                                            // 电影的信息
  watchedMovies: loadWatchedMovie(),                   // 看过的电影
  wantedMovies: loadWantedMovie(),                    // 想看的电影
  reviewsType: '',                                   // 电影的短评或影评的类型
  reviewId: 0,                                      // 电影影评的列表ID
  favoriteComments: loadComment(),                 // 电影短评的点赞
  searchHistory: loadSearch(),                    // 搜索历史，每次刷新从缓存中读取
  currentCelebrityId: 0,                         // 影人的ID
  collected: loadCelebrity()                    // 收藏影人
}

export default state
